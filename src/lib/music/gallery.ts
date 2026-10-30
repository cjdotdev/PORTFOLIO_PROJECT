// ─── Disc gallery (home, "On repeat") ──────────────────────────────
// The songs as CDs on an arc. The disc in front spins and leans toward the pointer; its neighbours
// turn slowly as they recede. Drag, the arrow keys, a sideways wheel or the buttons move along the
// arc; clicking the front disc flies it at the camera and opens it on the deck. Vertical wheel is
// left to the page so the section never traps scrolling.

import * as THREE from "three";
import { clamp, createDisc, createRenderer, damp, easeOut, studioEnvironment, type Disc, type SongData } from "./disc";

const ARC_RADIUS = 4.2;
const STEP = 0.52; // radians between neighbours on the arc
const VISIBLE = 4.6; // discs further than this from the front are hidden (and wrap round unseen)

export function mountGallery(root: HTMLElement, songs: SongData[], deckHref: string) {
  const stage = root.querySelector<HTMLElement>("[data-stage]")!;
  const canvas = stage.querySelector("canvas")!;
  const title = root.querySelector<HTMLAnchorElement>("[data-now-title]")!;
  const meta = root.querySelector<HTMLElement>("[data-now-meta]")!;
  const deckLink = root.querySelector<HTMLAnchorElement>("[data-now-deck]")!;
  const appleLink = root.querySelector<HTMLAnchorElement>("[data-now-apple]")!;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  const n = songs.length;

  const renderer = createRenderer(canvas);
  const scene = new THREE.Scene();
  scene.environment = studioEnvironment(renderer);
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  const key = new THREE.DirectionalLight(0xffffff, 0.7);
  key.position.set(2, 4, 6);
  scene.add(key);

  // A click through the hole still means the disc: each one carries an invisible full face to hit.
  const hitFace = new THREE.CircleGeometry(1, 48);
  const hitMaterial = new THREE.MeshBasicMaterial({ visible: false });
  const discs: Disc[] = songs.map((song) => {
    const disc = createDisc(song.cover, renderer);
    disc.spin.add(new THREE.Mesh(hitFace, hitMaterial));
    scene.add(disc.root);
    return disc;
  });
  const hitTargets = discs.map((disc) => disc.spin);

  // pos is where the arc is drawn (fractional while moving); target is where it settles.
  let pos = 0;
  let target = 0;
  let shown = -1;
  let flying: { index: number; start: number; href: string } | null = null;
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  const spinOf = discs.map((_, i) => i * 1.3);

  const wrap = (d: number) => ((((d + n / 2) % n) + n) % n) - n / 2;
  const indexAt = (p: number) => ((Math.round(p) % n) + n) % n;
  const hrefFor = (i: number) => `${deckHref}?song=${encodeURIComponent(songs[i].id)}`;

  function caption(i: number) {
    if (i === shown) return;
    shown = i;
    const song = songs[i];
    title.textContent = song.title;
    title.href = hrefFor(i);
    meta.textContent = `${song.artist} · ${song.album} · ${song.year}`;
    deckLink.href = hrefFor(i);
    appleLink.href = song.url;
    appleLink.querySelector("[data-sr-title]")!.textContent = `: ${song.title}`;
  }

  function go(next: number) {
    target = next;
    if (calm.matches) pos = target;
    caption(indexAt(target));
    wake();
  }

  function open(i: number) {
    const href = hrefFor(i);
    if (calm.matches) {
      window.location.assign(href);
      return;
    }
    flying = { index: i, start: performance.now(), href };
    wake();
  }

  // ─── Layout ───
  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Fit about this much of the arc on either side of the front disc, never cropping the front one.
    const halfWidth = clamp(camera.aspect * 1.7, 1.45, 4.2);
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.position.set(0, 0.15, Math.max(4.4, halfWidth / (t * camera.aspect)));
    camera.lookAt(0, 0, -0.6);
    camera.updateProjectionMatrix();
    wake();
  }

  // ─── Frame ───
  let last = performance.now();
  let running = false;
  let inView = false;
  let frame = 0;

  function place(dt: number, now: number) {
    pos = calm.matches ? target : damp(pos, target, 7, dt);
    tilt.x = damp(tilt.x, tilt.tx, 5, dt);
    tilt.y = damp(tilt.y, tilt.ty, 5, dt);

    discs.forEach((disc, i) => {
      const d = wrap(i - pos);
      const near = 1 - clamp(Math.abs(d), 0, 1); // 1 for the front disc
      const theta = d * STEP;
      const o = disc.root;
      o.visible = Math.abs(d) < VISIBLE;
      o.position.set(Math.sin(theta) * ARC_RADIUS, 0, (Math.cos(theta) - 1) * ARC_RADIUS);
      o.rotation.set(tilt.y * near, -theta * 0.5 + tilt.x * near, 0);
      o.scale.setScalar(0.7 + 0.3 * near);
      if (!calm.matches && flying?.index !== i) spinOf[i] -= dt * (0.25 + 1.1 * near);
      disc.spin.rotation.z = spinOf[i];
    });

    // The chosen disc stops turning, squares up to the viewer and comes forward while the stage fades:
    // it is being taken off the shelf, and the deck page picks the story up from there.
    if (flying) {
      const k = clamp((now - flying.start) / 520, 0, 1);
      const e = easeOut(k);
      const o = discs[flying.index].root;
      o.position.z += e * 1.6;
      o.rotation.x *= 1 - e;
      o.rotation.y *= 1 - e;
      stage.style.opacity = String(1 - clamp((k - 0.35) / 0.65, 0, 1));
      if (k >= 1) {
        const { href } = flying;
        flying = null;
        window.location.assign(href);
      }
    }
  }

  function loop(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    place(dt, now);
    renderer.render(scene, camera);
    // The spin is a loop: it stops when the section is off screen or the tab is hidden.
    if (inView && !document.hidden && (!calm.matches || flying)) frame = requestAnimationFrame(loop);
    else running = false;
  }

  function wake() {
    if (calm.matches && !flying) {
      place(0, performance.now());
      renderer.render(scene, camera);
      return;
    }
    if (running || !inView) return;
    running = true;
    last = performance.now();
    frame = requestAnimationFrame(loop);
  }

  // ─── Input ───
  const ray = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  function discAt(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(pointer, camera);
    for (const hit of ray.intersectObjects(hitTargets, true)) {
      const i = hitTargets.findIndex((group) => group === hit.object.parent);
      if (i >= 0 && discs[i].root.visible) return i;
    }
    return -1;
  }

  let drag: { x: number; pos: number; moved: number; lastX: number; lastT: number; v: number } | null = null;
  const perDisc = () => Math.max(120, stage.clientWidth / 4.5);

  stage.addEventListener("pointerdown", (event) => {
    if (flying) return;
    drag = { x: event.clientX, pos: target, moved: 0, lastX: event.clientX, lastT: performance.now(), v: 0 };
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    tilt.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 0.5;
    tilt.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 0.4;
    if (drag) {
      const now = performance.now();
      drag.moved = Math.max(drag.moved, Math.abs(event.clientX - drag.x));
      drag.v = (event.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
      drag.lastX = event.clientX;
      drag.lastT = now;
      target = drag.pos - (event.clientX - drag.x) / perDisc();
      caption(indexAt(target));
    } else if (event.pointerType === "mouse") {
      stage.style.cursor = discAt(event.clientX, event.clientY) >= 0 ? "pointer" : "grab";
    }
    wake();
  });
  const release = (event: PointerEvent) => {
    if (!drag) return;
    const wasClick = drag.moved < 6;
    // A flick carries on a little in the direction it was thrown.
    const fling = clamp(-drag.v * 2.2, -3, 3);
    drag = null;
    if (wasClick && event.type === "pointerup") {
      const i = discAt(event.clientX, event.clientY);
      if (i < 0) return go(Math.round(target));
      const d = Math.round(wrap(i - target));
      if (d === 0) open(i);
      else go(Math.round(target) + d);
      return;
    }
    go(Math.round(target + fling));
  };
  stage.addEventListener("pointerup", release);
  stage.addEventListener("pointercancel", release);
  stage.addEventListener("pointerleave", () => {
    tilt.tx = tilt.ty = 0;
    wake();
  });

  let wheelAcc = 0;
  let wheelAt = 0;
  stage.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const now = performance.now();
      if (now - wheelAt > 200) wheelAcc = 0;
      wheelAt = now;
      wheelAcc += event.deltaX;
      if (Math.abs(wheelAcc) > 60) {
        go(Math.round(target) + Math.sign(wheelAcc));
        wheelAcc = 0;
      }
    },
    { passive: false },
  );

  stage.addEventListener("keydown", (event) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    if (event.key in moves) {
      event.preventDefault();
      go(Math.round(target) + moves[event.key]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open(indexAt(target));
    }
  });
  root.querySelector("[data-prev]")!.addEventListener("click", () => go(Math.round(target) - 1));
  root.querySelector("[data-next]")!.addEventListener("click", () => go(Math.round(target) + 1));

  // ─── Lifecycle ───
  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    wake();
  }).observe(stage);
  document.addEventListener("visibilitychange", wake);
  calm.addEventListener("change", wake);
  // Coming back with the browser's back button restores the page mid-flight; settle it.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      flying = null;
      stage.style.opacity = "";
      wake();
    }
  });

  caption(0);
  resize();
  root.dataset.ready = "";
  return () => {
    cancelAnimationFrame(frame);
    renderer.dispose();
  };
}
