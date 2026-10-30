// ─── The compact disc, shared by the home gallery and the deck ─────
// A CD is three faces: the printed label (the album cover), the clear hub around the hole and the
// silvered data side, whose rainbow comes from MeshPhysicalMaterial's thin-film iridescence.

import * as THREE from "three";
import type { SongData } from "./support";

export type { SongData };
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/** Proportions of a real 120 mm disc: 15 mm hole, 46 mm clear hub, 1.2 mm thick. Radius is 1. */
const HOLE = 0.125;
const HUB = 0.38;
const STACK = 0.3; // the mirrored stacking ring between the clear hub and the label
export const DISC_THICKNESS = 0.02;


export function createRenderer(canvas: HTMLCanvasElement, shadows = false) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.setClearColor(0x000000, 0);
  if (shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
  }
  return renderer;
}

/** A soft studio room baked into an environment map: it is what the metal and the data side reflect. */
export function studioEnvironment(renderer: THREE.WebGLRenderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const texture = pmrem.fromScene(room, 0.04).texture;
  room.dispose();
  pmrem.dispose();
  return texture;
}

/** Concentric bands of slightly different roughness: the data tracks catching the light. */
function trackTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#4a4a4a";
  ctx.fillRect(0, 0, size, size);
  const c = size / 2;
  for (let r = c * HUB; r < c; r += 1.5) {
    const v = 50 + Math.round(Math.random() * 40);
    ctx.strokeStyle = `rgb(${v},${v},${v})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(c, c, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  // The burn line where a pressed disc's data ends.
  ctx.strokeStyle = "#202020";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.93, 0, Math.PI * 2);
  ctx.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

let shared: {
  label: THREE.RingGeometry;
  data: THREE.RingGeometry;
  hub: THREE.RingGeometry;
  band: THREE.RingGeometry;
  rim: THREE.CylinderGeometry;
  dataMaterial: THREE.MeshPhysicalMaterial;
  hubMaterial: THREE.MeshPhysicalMaterial;
  bandMaterial: THREE.MeshPhysicalMaterial;
  rimMaterial: THREE.MeshPhysicalMaterial;
} | null = null;

function sharedParts() {
  if (shared) return shared;
  // RingGeometry maps UVs across the square that bounds it, so a square cover lands centred; the hub hides its middle.
  const label = new THREE.RingGeometry(HUB, 1, 128, 1);
  const data = new THREE.RingGeometry(HUB, 1, 128, 1);
  data.rotateY(Math.PI);
  const hub = new THREE.RingGeometry(HOLE, STACK, 64, 1);
  const band = new THREE.RingGeometry(STACK, HUB, 96, 1);
  const rim = new THREE.CylinderGeometry(1, 1, DISC_THICKNESS, 128, 1, true);
  rim.rotateX(Math.PI / 2);
  shared = {
    label,
    data,
    hub,
    band,
    rim,
    dataMaterial: new THREE.MeshPhysicalMaterial({
      color: 0xdedede,
      metalness: 1,
      roughness: 0.16,
      roughnessMap: trackTexture(),
      iridescence: 1,
      iridescenceIOR: 1.9,
      iridescenceThicknessRange: [180, 820],
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.6,
    }),
    hubMaterial: new THREE.MeshPhysicalMaterial({
      color: 0xdfe6ea,
      metalness: 0,
      roughness: 0.05,
      transparent: true,
      opacity: 0.16,
      clearcoat: 1,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    bandMaterial: new THREE.MeshPhysicalMaterial({ color: 0xd9dcde, metalness: 1, roughness: 0.14, side: THREE.DoubleSide }),
    rimMaterial: new THREE.MeshPhysicalMaterial({ color: 0xcfd2d4, metalness: 0.9, roughness: 0.2 }),
  };
  return shared;
}

/**
 * The album cover as a texture. The label stays dark grey until it arrives. The covers are on this
 * site, so a plain image is enough; TextureLoader's crossorigin request would miss the copy the
 * page's own <img> tags already cached and fail.
 */
export function loadCover(url: string, renderer: THREE.WebGLRenderer, material: THREE.MeshPhysicalMaterial) {
  const image = new Image();
  image.decoding = "async";
  image.src = url;
  image.decode().then(() => {
    const texture = new THREE.Texture(image);
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    material.map = texture;
    material.color.set(0xffffff);
    material.needsUpdate = true;
  }, () => {});
}

export interface Disc {
  /** Placed and oriented by the scene. */
  root: THREE.Group;
  /** Turns around the disc's own axis (local z): the spin. */
  spin: THREE.Group;
  label: THREE.MeshPhysicalMaterial;
}

/** A disc in the XY plane, label facing +z. */
export function createDisc(cover: string, renderer: THREE.WebGLRenderer): Disc {
  const parts = sharedParts();
  // Printed ink is matte; a light clearcoat and a weak reflection keep the artwork's own colours.
  const label = new THREE.MeshPhysicalMaterial({
    color: 0x2c2c2c,
    roughness: 0.55,
    clearcoat: 0.35,
    clearcoatRoughness: 0.2,
    envMapIntensity: 0.35,
  });
  loadCover(cover, renderer, label);

  const root = new THREE.Group();
  const spin = new THREE.Group();
  root.add(spin);

  const front = new THREE.Mesh(parts.label, label);
  front.position.z = DISC_THICKNESS / 2;
  const back = new THREE.Mesh(parts.data, parts.dataMaterial);
  back.position.z = -DISC_THICKNESS / 2;
  const hub = new THREE.Mesh(parts.hub, parts.hubMaterial);
  const band = new THREE.Mesh(parts.band, parts.bandMaterial);
  const rim = new THREE.Mesh(parts.rim, parts.rimMaterial);
  front.receiveShadow = true;
  for (const mesh of [back, band, rim]) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  }
  spin.add(front, back, hub, band, rim);
  root.userData.label = label;
  return { root, spin, label };
}

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
export const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
export const easeOut = (k: number) => 1 - Math.pow(1 - k, 4);
/** Frame-rate independent approach to a target. */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));
