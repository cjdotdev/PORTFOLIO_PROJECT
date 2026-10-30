// ─── The deck (/music) ─────────────────────────────────────────────
// A platinum CD deck, a round tray holding the eleven discs, and a robotic arm between them. When a
// song is chosen the tray turns that disc to the pickup point, the arm lifts it by suction, swings
// it over and lays it on the platter, and the laser arm swings in. Changing song puts the playing
// disc back in its slot first. The arm is solved each frame from where its suction cup should be
// (yaw, then two links in the vertical plane), so every move is just a path for the cup.

import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { DISC_THICKNESS, clamp, createDisc, createRenderer, damp, easeInOut, studioEnvironment, type Disc, type SongData } from "./disc";

const ACCENT = 0xae4b2b;

// World units, y up, the camera in front on +z.
const R = 0.72; // disc radius here
const TH = DISC_THICKNESS * R;
const ARM = new THREE.Vector3(0, 0, -0.4);
const SHOULDER_Y = 1.05;
const L1 = 1.9;
const L2 = 1.9;
const WRIST = 0.38; // wrist joint to the face of the suction cup

const TRAY = new THREE.Vector3(-2.7, 0, -3.65);
const TRAY_RING = 2.6;
const TRAY_TOP = 0.22;

const DECK = { x: 2.95, z: 1.5, w: 4.5, h: 0.5, d: 3.4 };
const PLATTER = new THREE.Vector3(2.2, DECK.h, 1.55);
const PLATTER_DISC_Y = 0.075 + TH / 2; // disc centre above the deck top
const TONE = new THREE.Vector3(3.8, DECK.h, 0.4); // laser arm pivot
const TONE_LEN = 1.6;
const HOVER = 0.85;

const wrapPi = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export interface DeckCallbacks {
  /** The disc is on the platter and the laser arm is over it: the song can start. */
  onLoaded: (index: number) => void;
}

export function mountDeck(stage: HTMLElement, songs: SongData[], callbacks: DeckCallbacks) {
  const canvas = stage.querySelector("canvas")!;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  const n = songs.length;

  const renderer = createRenderer(canvas, true);
  const scene = new THREE.Scene();
  scene.environment = studioEnvironment(renderer);
  scene.environmentIntensity = 0.9;
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(3, 10, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 30 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.16 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // ─── Materials ───
  const platinum = new THREE.MeshPhysicalMaterial({
    color: 0xe5e4e2,
    metalness: 1,
    roughness: 0.3,
    anisotropy: 0.7,
    clearcoat: 0.35,
    clearcoatRoughness: 0.25,
  });
  const polished = new THREE.MeshPhysicalMaterial({ color: 0xf0efed, metalness: 1, roughness: 0.1 });
  const graphite = new THREE.MeshPhysicalMaterial({ color: 0x1d1d1d, metalness: 0.3, roughness: 0.5, clearcoat: 0.3 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.92 });
  const ember = new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 0.5, roughness: 0.4 });
  const laser = new THREE.MeshStandardMaterial({ color: ACCENT, emissive: ACCENT, emissiveIntensity: 0, roughness: 0.3 });

  const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, cast = true) => {
    const m = new THREE.Mesh(geometry, material);
    m.castShadow = cast;
    m.receiveShadow = true;
    return m;
  };
  /** A cylinder lying along +x from the origin. */
  const alongX = (radius: number, length: number, radius2 = radius) =>
    new THREE.CylinderGeometry(radius2, radius, length, 48).rotateZ(-Math.PI / 2).translate(length / 2, 0, 0);
  /** A joint: a cylinder across the arm, along z. */
  const joint = (radius: number, length: number) => new THREE.CylinderGeometry(radius, radius, length, 48).rotateX(Math.PI / 2);
  const box = (w: number, h: number, d: number, r: number) => new RoundedBoxGeometry(w, h, d, 4, r);

  // ─── Deck ───
  const deck = new THREE.Group();
  scene.add(deck);
  const body = mesh(box(DECK.w, DECK.h, DECK.d, 0.1), platinum);
  body.position.set(DECK.x, DECK.h / 2, DECK.z);
  deck.add(body);
  const well = mesh(new THREE.RingGeometry(0.9, 0.95, 96).rotateX(-Math.PI / 2), graphite, false);
  well.position.set(PLATTER.x, DECK.h + 0.002, PLATTER.z);
  deck.add(well);

  const platter = new THREE.Group();
  platter.position.copy(PLATTER);
  deck.add(platter);
  const ring = mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.04, 96), polished);
  ring.position.y = 0.02;
  const mat = mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.03, 96), rubber);
  mat.position.y = 0.055;
  const spindle = mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.1, 32), polished);
  spindle.position.y = 0.09;
  platter.add(ring, mat, spindle);
  const turntable = new THREE.Group(); // what turns, with the disc on it
  turntable.position.y = PLATTER_DISC_Y;
  platter.add(turntable);

  // The laser arm: a polished bar on a post, its head carrying a terracotta diode that lights while playing.
  const tone = new THREE.Group();
  tone.position.copy(TONE);
  deck.add(tone);
  const post = mesh(new THREE.CylinderGeometry(0.15, 0.19, 0.22, 48), polished);
  post.position.y = 0.11;
  tone.add(post);
  const swing = new THREE.Group();
  swing.position.y = 0.2;
  tone.add(swing);
  swing.add(mesh(alongX(0.04, TONE_LEN), polished));
  const head = mesh(box(0.28, 0.08, 0.17, 0.03), graphite);
  head.position.x = TONE_LEN;
  swing.add(head);
  const diode = mesh(new THREE.SphereGeometry(0.03, 16, 16), laser, false);
  diode.position.set(TONE_LEN + 0.05, -0.045, 0);
  swing.add(diode);
  // Two swing angles from the pivot: the head over the disc's middle, and parked beside the platter.
  const toPlatter = new THREE.Vector2(PLATTER.x - TONE.x, PLATTER.z - TONE.z);
  const q = toPlatter.length();
  const toward = Math.atan2(-toPlatter.y, toPlatter.x);
  const angleFor = (r: number) => toward + Math.acos((q * q + TONE_LEN * TONE_LEN - r * r) / (2 * q * TONE_LEN));
  const TONE_PLAY = angleFor(R * 0.62);
  const TONE_REST = angleFor(1.2);
  let toneAngle = TONE_REST;

  // The front panel: three keys, a power light and a display that shows the track and its time.
  const front = DECK.z + DECK.d / 2;
  for (let i = 0; i < 3; i += 1) {
    const keyCap = mesh(joint(0.075, 0.05), graphite, false);
    keyCap.position.set(DECK.x - 1.35 + i * 0.26, DECK.h * 0.5, front + 0.01);
    deck.add(keyCap);
  }
  const power = mesh(new THREE.SphereGeometry(0.03, 16, 16), ember, false);
  power.position.set(DECK.x - 0.48, DECK.h * 0.5, front + 0.005);
  deck.add(power);

  const lcdCanvas = document.createElement("canvas");
  lcdCanvas.width = 1024;
  lcdCanvas.height = 160;
  const lcdTexture = new THREE.CanvasTexture(lcdCanvas);
  lcdTexture.colorSpace = THREE.SRGBColorSpace;
  lcdTexture.anisotropy = 8;
  const lcd = new THREE.Mesh(
    new THREE.PlaneGeometry(1.7, 0.266),
    new THREE.MeshStandardMaterial({ map: lcdTexture, emissiveMap: lcdTexture, emissive: 0xffffff, emissiveIntensity: 0.9, roughness: 0.25 }),
  );
  lcd.position.set(DECK.x + 0.65, DECK.h * 0.5, front + 0.004);
  deck.add(lcd);
  const displayFont = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() || "sans-serif";
  let lcdState = "";
  function drawLcd(index: number | null, seconds: number, label?: string) {
    const text = index === null ? (label ?? "") : `${String(index + 1).padStart(2, "0")}  ${songs[index].title}`;
    const time = index === null ? "" : `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
    const state = `${text}|${time}`;
    if (state === lcdState) return;
    lcdState = state;
    const ctx = lcdCanvas.getContext("2d")!;
    ctx.fillStyle = "#0d0d0d";
    ctx.fillRect(0, 0, 1024, 160);
    ctx.fillStyle = "#e8916f";
    ctx.textBaseline = "middle";
    ctx.font = `500 64px ${displayFont}`;
    ctx.textAlign = "left";
    let shown = text;
    while (shown.length > 4 && ctx.measureText(shown).width > 760) shown = `${shown.slice(0, -2)}…`;
    ctx.fillText(shown, 40, 84);
    ctx.textAlign = "right";
    ctx.fillText(time, 984, 84);
    lcdTexture.needsUpdate = true;
    wake();
  }

  // ─── Tray ───
  const tray = new THREE.Group();
  tray.position.copy(TRAY);
  scene.add(tray);
  const trayBase = mesh(new THREE.CylinderGeometry(3.45, 3.55, 0.2, 128), platinum);
  trayBase.position.y = 0.1;
  tray.add(trayBase);
  const carousel = new THREE.Group();
  carousel.position.y = TRAY_TOP;
  tray.add(carousel);
  const hub = mesh(new THREE.CylinderGeometry(1.05, 1.15, 0.26, 96), polished);
  hub.position.y = 0.13;
  carousel.add(hub);
  const slotAngle = (k: number) => (k / n) * Math.PI * 2;
  const slotPosition = (k: number) =>
    new THREE.Vector3(Math.cos(slotAngle(k)) * TRAY_RING, 0.02 + TH / 2, -Math.sin(slotAngle(k)) * TRAY_RING);
  for (let k = 0; k < n; k += 1) {
    const pad = mesh(new THREE.CylinderGeometry(R + 0.03, R + 0.03, 0.02, 64), graphite, false);
    pad.position.copy(slotPosition(k)).setY(0.01);
    carousel.add(pad);
  }
  // Where the arm picks: the point of the ring nearest the arm, marked by a light on the tray's rim.
  const PICK_ANGLE = Math.atan2(-(ARM.z - TRAY.z), ARM.x - TRAY.x);
  const pickLight = mesh(new THREE.SphereGeometry(0.045, 16, 16), ember, false);
  pickLight.position.set(Math.cos(PICK_ANGLE) * 3.5, 0.12, -Math.sin(PICK_ANGLE) * 3.5);
  tray.add(pickLight);
  let trayAngle = 0;

  const discs: Disc[] = songs.map((song, k) => {
    const disc = createDisc(song.cover, renderer);
    disc.root.scale.setScalar(R);
    disc.root.rotation.x = -Math.PI / 2;
    disc.root.position.copy(slotPosition(k));
    carousel.add(disc.root);
    return disc;
  });

  // ─── Arm ───
  const arm = new THREE.Group();
  arm.position.copy(ARM);
  scene.add(arm);
  const foot = mesh(new THREE.CylinderGeometry(0.6, 0.68, 0.16, 64), platinum);
  foot.position.y = 0.08;
  arm.add(foot);
  const turret = new THREE.Group();
  turret.position.y = 0.16;
  arm.add(turret);
  const columnHeight = SHOULDER_Y - 0.16;
  const column = mesh(new THREE.CylinderGeometry(0.3, 0.38, columnHeight, 48), platinum);
  column.position.y = columnHeight / 2;
  turret.add(column);
  const shoulder = mesh(joint(0.27, 0.58), graphite);
  shoulder.position.y = columnHeight;
  const shoulderLight = mesh(joint(0.11, 0.6), ember, false);
  shoulderLight.position.y = columnHeight;
  turret.add(shoulder, shoulderLight);

  const upper = new THREE.Group();
  upper.position.y = columnHeight;
  turret.add(upper);
  upper.add(mesh(box(L1, 0.24, 0.3, 0.09).translate(L1 / 2, 0, 0), platinum));
  const elbow = mesh(joint(0.2, 0.44), graphite);
  elbow.position.x = L1;
  upper.add(elbow);

  const fore = new THREE.Group();
  fore.position.x = L1;
  upper.add(fore);
  fore.add(mesh(box(L2, 0.18, 0.22, 0.07).translate(L2 / 2, 0, 0), platinum));
  const wristJoint = mesh(joint(0.14, 0.32), graphite);
  wristJoint.position.x = L2;
  fore.add(wristJoint);

  const wrist = new THREE.Group(); // its +x points straight down
  wrist.position.x = L2;
  fore.add(wrist);
  wrist.add(mesh(alongX(0.065, WRIST - 0.08), polished));
  const cupRing = mesh(alongX(0.13, 0.025), ember, false);
  cupRing.position.x = WRIST - 0.13;
  const cup = mesh(alongX(0.13, 0.08, 0.21), rubber);
  cup.position.x = WRIST - 0.08;
  wrist.add(cupRing, cup);

  const tip = new THREE.Vector3();
  const REST = new THREE.Vector3();
  function polar(v: THREE.Vector3) {
    return { angle: Math.atan2(-(v.z - ARM.z), v.x - ARM.x), radius: Math.hypot(v.x - ARM.x, v.z - ARM.z), y: v.y };
  }
  function fromPolar(angle: number, radius: number, y: number, out = new THREE.Vector3()) {
    return out.set(ARM.x + Math.cos(angle) * radius, y, ARM.z - Math.sin(angle) * radius);
  }
  fromPolar(Math.PI * 0.42, 1.7, 2.3, REST);
  tip.copy(REST);

  function solveArm() {
    const dx = tip.x - ARM.x;
    const dz = tip.z - ARM.z;
    turret.rotation.y = Math.atan2(-dz, dx);
    const h = Math.hypot(dx, dz);
    const v = tip.y + WRIST - (ARM.y + SHOULDER_Y);
    const d = clamp(Math.hypot(h, v), 0.3, L1 + L2 - 0.001);
    const a = Math.atan2(v, h) + Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    const b = Math.atan2(v - L1 * Math.sin(a), h - L1 * Math.cos(a));
    upper.rotation.z = a;
    fore.rotation.z = b - a;
    wrist.rotation.z = -Math.PI / 2 - b;
  }

  // ─── Timeline ───
  interface Tween {
    t: number;
    dur: number;
    fn: (k: number) => void;
    done: () => void;
  }
  const tweens: Tween[] = [];
  function tween(dur: number, fn: (k: number) => void) {
    if (calm.matches || dur <= 0) {
      fn(1);
      wake();
      return Promise.resolve();
    }
    return new Promise<void>((done) => {
      tweens.push({ t: 0, dur, fn, done });
      wake();
    });
  }

  /** Swing the cup to a point the way an arm does: around its base, not through it. */
  function moveTip(to: THREE.Vector3, dur: number, lift = 0) {
    const a = polar(tip);
    const b = polar(to);
    const turn = wrapPi(b.angle - a.angle);
    return tween(dur, (k) => {
      const e = easeInOut(k);
      fromPolar(a.angle + turn * e, lerp(a.radius, b.radius, e), lerp(a.y, b.y, e) + lift * Math.sin(Math.PI * e), tip);
    });
  }

  function turnTrayTo(k: number, dur: number) {
    const from = trayAngle;
    const to = from + wrapPi(PICK_ANGLE - slotAngle(k) - from);
    return tween(dur, (e) => {
      trayAngle = lerp(from, to, easeInOut(e));
    });
  }

  function swingTone(to: number, dur: number) {
    const from = toneAngle;
    return tween(dur, (e) => {
      toneAngle = lerp(from, to, easeInOut(e));
    });
  }

  const pickTop = new THREE.Vector3(
    TRAY.x + Math.cos(PICK_ANGLE) * TRAY_RING,
    TRAY_TOP + 0.02 + TH + 0.002,
    TRAY.z - Math.sin(PICK_ANGLE) * TRAY_RING,
  );
  const pickHover = pickTop.clone().setY(pickTop.y + HOVER);
  const platterTop = new THREE.Vector3(PLATTER.x, PLATTER.y + PLATTER_DISC_Y + TH / 2 + 0.002, PLATTER.z);
  const platterHover = platterTop.clone().setY(platterTop.y + HOVER);

  let held: Disc | null = null;
  let onPlatter: number | null = null;
  let spinSpeed = 0;
  let playing = false;

  function grab(disc: Disc) {
    scene.attach(disc.root);
    held = disc;
  }
  function dropInSlot(k: number) {
    carousel.attach(discs[k].root);
    discs[k].root.position.copy(slotPosition(k));
    held = null;
  }
  function dropOnPlatter(k: number) {
    turntable.attach(discs[k].root);
    discs[k].root.position.set(0, 0, 0);
    held = null;
  }

  const S = 1; // one knob for the pace of the whole sequence
  async function swap(to: number) {
    drawLcd(null, 0, "…");
    if (onPlatter !== null) {
      const back = onPlatter;
      playing = false;
      await swingTone(TONE_REST, 0.45 * S);
      await moveTip(platterHover, 0.8 * S, 0.3);
      await moveTip(platterTop, 0.32 * S);
      grab(discs[back]);
      onPlatter = null;
      await moveTip(platterHover, 0.3 * S);
      await Promise.all([turnTrayTo(back, 0.9 * S), moveTip(pickHover, 1.0 * S, 0.35)]);
      await moveTip(pickTop, 0.3 * S);
      dropInSlot(back);
      await moveTip(pickHover, 0.28 * S);
    }
    await Promise.all([turnTrayTo(to, 0.8 * S), moveTip(pickHover, 0.7 * S, 0.2)]);
    await moveTip(pickTop, 0.32 * S);
    grab(discs[to]);
    await moveTip(pickHover, 0.3 * S);
    await moveTip(platterHover, 1.05 * S, 0.45);
    await moveTip(platterTop, 0.34 * S);
    dropOnPlatter(to);
    onPlatter = to;
    const away = moveTip(REST, 0.9 * S, 0.2);
    await swingTone(TONE_PLAY, 0.5 * S);
    drawLcd(to, 0);
    callbacks.onLoaded(to);
    await away;
  }

  let wanted: number | null = null;
  let busy = false;
  async function settle() {
    if (busy) return;
    busy = true;
    while (wanted !== null && wanted !== onPlatter) await swap(wanted);
    busy = false;
  }

  // ─── Frame ───
  const look = new THREE.Vector3();
  const drift = { x: 0, y: 0, tx: 0, ty: 0 };
  let fit = { center: new THREE.Vector3(-0.4, 0.3, -1.0), halfWidth: 6.3, elevation: 0.6 };

  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    // The scene is wide and shallow. On a tall stage the camera looks down more steeply to fill the
    // height, and on a phone it frames the arm and the deck and lets the far side of the tray go.
    const tall = clamp((1.3 - camera.aspect) / 0.6, 0, 1);
    const phone = clamp((0.95 - camera.aspect) / 0.3, 0, 1);
    fit = {
      center: new THREE.Vector3(lerp(-0.4, 0.9, phone), 0.3, lerp(-1.0, -0.2, phone)),
      halfWidth: lerp(6.3, 4.6, phone),
      elevation: lerp(0.6, 0.92, tall),
    };
    wake();
  }

  function placeCamera() {
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    const distance = Math.max(fit.halfWidth / Math.tan(hfov / 2), 3.6 / Math.tan(vfov / 2));
    const azimuth = 0.1 + drift.x * 0.12;
    const elevation = fit.elevation + drift.y * 0.05;
    camera.position.set(
      fit.center.x + Math.sin(azimuth) * Math.cos(elevation) * distance,
      fit.center.y + Math.sin(elevation) * distance,
      fit.center.z + Math.cos(azimuth) * Math.cos(elevation) * distance,
    );
    look.copy(fit.center);
    camera.lookAt(look);
  }

  function step(dt: number) {
    for (let i = tweens.length - 1; i >= 0; i -= 1) {
      const t = tweens[i];
      t.t += dt;
      const k = Math.min(1, t.t / t.dur);
      t.fn(k);
      if (k >= 1) {
        tweens.splice(i, 1);
        t.done();
      }
    }
    if (!calm.matches) {
      spinSpeed = damp(spinSpeed, playing ? 5.2 : 0, 2.2, dt);
      turntable.rotation.y -= spinSpeed * dt;
      drift.x = damp(drift.x, drift.tx, 2.5, dt);
      drift.y = damp(drift.y, drift.ty, 2.5, dt);
    }
    carousel.rotation.y = trayAngle;
    swing.rotation.y = toneAngle;
    laser.emissiveIntensity = playing ? 1.6 : 0;
    solveArm();
    if (held) held.root.position.set(tip.x, tip.y - TH / 2 - 0.002, tip.z);
    placeCamera();
  }

  let last = performance.now();
  let running = false;
  let inView = true;
  function loop(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    step(dt);
    renderer.render(scene, camera);
    const moving = tweens.length > 0 || spinSpeed > 0.01 || playing;
    if (inView && !document.hidden && (moving || !calm.matches)) requestAnimationFrame(loop);
    else running = false;
  }
  function wake() {
    if (running || !inView) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  }

  stage.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    drift.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    drift.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  });
  stage.addEventListener("pointerleave", () => {
    drift.tx = drift.ty = 0;
  });

  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    wake();
  }).observe(stage);
  document.addEventListener("visibilitychange", wake);
  calm.addEventListener("change", wake);
  // The display uses the page's display face; draw it again once that face has loaded.
  document.fonts?.ready.then(() => {
    lcdState = "";
    drawLcd(onPlatter, 0, "…");
  });

  resize();
  drawLcd(null, 0, "");
  stage.dataset.ready = "";

  return {
    request(index: number) {
      wanted = index;
      void settle();
    },
    setPlaying(on: boolean) {
      playing = on && onPlatter !== null;
      wake();
    },
    setTime(index: number, seconds: number) {
      if (index === onPlatter) drawLcd(index, seconds);
    },
  };
}

export type Deck = ReturnType<typeof mountDeck>;
