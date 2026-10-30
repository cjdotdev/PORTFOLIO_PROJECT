// ─── Flat CD (/music on a phone, or without WebGL) ─────────────────
// One large disc instead of the 3D deck: it spins up while the song plays and coasts to a stop on
// pause, and changing song slides the disc out and the next one in. It answers the player the same
// way the deck does, so the player does not know which one it is driving.

import type { SongData } from "./support";

const TOP_SPEED = 1.9; // radians a second, about 18 rpm: slow enough to read the cover

export function mountFlat(stage: HTMLElement, songs: SongData[], callbacks: { onLoaded: (index: number) => void }) {
  const disc = stage.querySelector<HTMLElement>("[data-cd]")!;
  const ring = stage.querySelector<SVGCircleElement>("[data-ring]")!;
  const cover = disc.querySelector<HTMLImageElement>("[data-fallback]")!;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

  let shown: number | null = null;
  let wanted: number | null = null;
  let busy = false;

  // ─── Spin: a speed that eases toward its target, so play and pause feel like a motor ───
  let playing = false;
  let speed = 0;
  let angle = 0;
  let frame = 0;
  let last = 0;

  function loop(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    speed += ((playing ? TOP_SPEED : 0) - speed) * (1 - Math.exp(-(playing ? 1.6 : 1.1) * dt));
    angle = (angle + speed * dt) % (Math.PI * 2);
    cover.style.transform = `rotate(${angle}rad)`;
    frame = !playing && speed < 0.01 ? 0 : requestAnimationFrame(loop);
  }
  function wake() {
    if (frame || calm.matches || (!playing && speed < 0.01)) return;
    last = performance.now();
    frame = requestAnimationFrame(loop);
  }

  // ─── Swap: out to the left, in from the right, as if the tray took one and gave the next ───
  async function swap(to: number) {
    const src = songs[to].cover;
    if (calm.matches || shown === null) {
      cover.src = src;
      await cover.decode().catch(() => {});
    } else {
      await disc.animate(
        [{ transform: "none", opacity: 1 }, { transform: "translateX(-55%) rotate(-50deg)", opacity: 0 }],
        { duration: 300, easing: "cubic-bezier(0.55, 0, 1, 0.45)" },
      ).finished;
      disc.style.opacity = "0";
      cover.src = src;
      await cover.decode().catch(() => {});
      angle = 0;
      cover.style.transform = "";
      disc.style.opacity = "";
      await disc.animate(
        [{ transform: "translateX(55%) rotate(50deg)", opacity: 0 }, { transform: "none", opacity: 1 }],
        { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
      ).finished;
    }
    shown = to;
    callbacks.onLoaded(to);
  }

  async function settle() {
    if (busy) return;
    busy = true;
    while (wanted !== null && wanted !== shown) await swap(wanted);
    busy = false;
  }

  stage.dataset.flat = "";

  // The ring around the disc fills clockwise from the top as the song plays (pathLength is 1).
  function progress(share: number) {
    ring.style.strokeDashoffset = String(1 - Math.min(1, Math.max(0, share)));
  }

  return {
    request(index: number) {
      progress(0);
      wanted = index;
      void settle();
    },
    setPlaying(on: boolean) {
      playing = on;
      wake();
    },
    setTime(index: number, seconds: number, duration: number) {
      if (index === shown) progress(seconds / duration);
    },
  };
}
