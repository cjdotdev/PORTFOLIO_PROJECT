// ─── Level meter (/music) ──────────────────────────────────────────
// A row of bars under the disc that moves with the song. Apple serves the previews with open CORS,
// so the audio goes through an AnalyserNode and the bars are the song's real levels. An audio element
// routed into a suspended context plays silence, so the routing only happens once the browser lets the
// context run (straight away if autoplay is allowed, otherwise on the first tap or key). Until then the
// bars rest: they never show a pattern that is not the music.

const BARS = 28;

export function mountMeter(canvas: HTMLCanvasElement, audio: HTMLAudioElement) {
  const ctx2d = canvas.getContext("2d")!;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  const levels = new Float32Array(BARS);

  let analyser: AnalyserNode | null = null;
  let bins: Uint8Array<ArrayBuffer> | null = null;
  let context: AudioContext | null = null;

  try {
    context = new AudioContext();
  } catch {
    context = null;
  }

  function route() {
    if (analyser || !context || context.state !== "running") return;
    try {
      analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.55;
      analyser.minDecibels = -85;
      analyser.maxDecibels = -20;
      context.createMediaElementSource(audio).connect(analyser);
      analyser.connect(context.destination);
      bins = new Uint8Array(analyser.frequencyBinCount);
      wake();
    } catch {
      analyser = null;
    }
  }
  function unlock() {
    context?.resume().then(route, () => {});
  }
  for (const type of ["pointerdown", "keydown"] as const) window.addEventListener(type, unlock, { passive: true });
  audio.addEventListener("play", unlock);

  // Bars are spaced on a log scale (bass on the left), skipping the lowest bin and the empty top.
  const edges = Array.from({ length: BARS + 1 }, (_, i) => Math.round(2 * Math.pow(90 / 2, i / BARS)));

  function sample(i: number) {
    if (!bins || context?.state !== "running") return 0;
    let sum = 0;
    const from = edges[i];
    const to = Math.max(from + 1, edges[i + 1]);
    for (let b = from; b < to; b += 1) sum += bins[b];
    // The raw levels sit high and close together; a curve spreads them so quiet and loud read apart,
    // and the treble, which is quieter, gets a lift so the right side still moves.
    return Math.min(1, Math.pow(sum / (to - from) / 255, 2.2) * (1 + 0.9 * (i / BARS)));
  }

  let colour = "";
  let frame = 0;
  let last = 0;
  let count = 0;

  function draw(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const playing = !audio.paused;
    if (analyser && bins) analyser.getByteFrequencyData(bins);
    if (count++ % 30 === 0) colour = getComputedStyle(canvas).color;

    const ratio = Math.min(window.devicePixelRatio, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * ratio) || canvas.height !== Math.round(h * ratio)) {
      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
    }
    ctx2d.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx2d.clearRect(0, 0, w, h);
    ctx2d.fillStyle = colour;

    const gap = w / BARS;
    const bar = Math.max(2, gap * 0.45);
    let moving = false;
    for (let i = 0; i < BARS; i += 1) {
      const target = playing ? sample(i) : 0;
      // Quick to rise, slower to fall, like a real meter.
      const rate = target > levels[i] ? 18 : 6;
      levels[i] += (target - levels[i]) * (1 - Math.exp(-rate * dt));
      if (levels[i] > 0.002) moving = true;
      const height = Math.max(bar, levels[i] * h);
      ctx2d.beginPath();
      ctx2d.roundRect(i * gap + (gap - bar) / 2, h - height, bar, height, bar / 2);
      ctx2d.fill();
    }
    frame = playing || moving ? requestAnimationFrame(draw) : 0;
  }

  function wake() {
    if (frame) return;
    last = performance.now();
    if (calm.matches) {
      // No motion: the bars rest as a quiet row of dots.
      draw(last);
      cancelAnimationFrame(frame);
      frame = 0;
      return;
    }
    frame = requestAnimationFrame(draw);
  }
  audio.addEventListener("play", wake);
  audio.addEventListener("pause", wake);
  new ResizeObserver(wake).observe(canvas);
  document.fonts?.ready.then(wake);
  route();
  wake();
}
