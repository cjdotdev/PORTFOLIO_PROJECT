// ─── Player (/music) ───────────────────────────────────────────────
// The playlist, the controls and the audio. It drives either the 3D deck or the flat CD that stands
// in for it; a song only starts once its disc is on.

import type { SongData, Turntable } from "./support";

interface Labels {
  play: string;
  pause: string;
  loading: string;
  ready: string;
  playing: string;
}

export function mountPlayer(root: HTMLElement, songs: SongData[], labels: Labels) {
  const audio = root.querySelector<HTMLAudioElement>("[data-audio]")!;
  const rows = [...root.querySelectorAll<HTMLButtonElement>("[data-track]")];
  const status = root.querySelector<HTMLElement>("[data-status]")!;
  const title = root.querySelector<HTMLElement>("[data-title]")!;
  const meta = root.querySelector<HTMLElement>("[data-meta]")!;
  const apple = root.querySelector<HTMLAnchorElement>("[data-apple]")!;
  const toggle = root.querySelector<HTMLButtonElement>("[data-toggle]")!;
  const bar = root.querySelector<HTMLElement>("[data-bar]")!;
  const elapsed = root.querySelector<HTMLElement>("[data-elapsed]")!;

  let deck: Turntable | null = null;
  let current = 0;
  let loaded = -1; // the song whose disc is on the platter
  let wantsPlay = false;

  // ─── Prefetch: each preview (about 1 MB) is fetched whole into memory before it is needed, so
  // pressing play starts at once. The chosen song, the one after it and any row the pointer or focus
  // rests on are fetched; the network URL is the fallback until (or unless) the copy arrives.
  const copies = new Map<number, string>();
  const fetching = new Set<number>();
  function warm(index: number) {
    const i = (index + songs.length) % songs.length;
    if (copies.has(i) || fetching.has(i)) return;
    fetching.add(i);
    fetch(songs[i].preview, { mode: "cors" })
      .then((response) => (response.ok ? response.blob() : Promise.reject(new Error(String(response.status)))))
      .then((blob) => copies.set(i, URL.createObjectURL(blob)))
      .catch(() => {})
      .finally(() => fetching.delete(i));
  }

  const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  function render() {
    const song = songs[current];
    const isPlaying = !audio.paused;
    rows.forEach((row, i) => (i === current ? row.setAttribute("aria-current", "true") : row.removeAttribute("aria-current")));
    rows.forEach((row) => row.removeAttribute("data-playing"));
    if (isPlaying) rows[current].dataset.playing = "";
    title.textContent = song.title;
    meta.textContent = `${song.artist} · ${song.album} · ${song.year}`;
    apple.href = song.url;
    toggle.dataset.state = isPlaying ? "pause" : "play";
    toggle.setAttribute("aria-label", isPlaying ? labels.pause : labels.play);
    status.textContent = loaded !== current ? labels.loading : isPlaying ? labels.playing : labels.ready;
    root.toggleAttribute("data-loading", loaded !== current);
  }

  function start() {
    if (loaded !== current) return;
    audio.play().catch(() => {
      // Autoplay blocked (no click on this page yet): the disc waits on the platter for play.
      wantsPlay = false;
      render();
    });
  }

  function choose(index: number, play: boolean) {
    current = (index + songs.length) % songs.length;
    wantsPlay = play;
    audio.pause();
    audio.src = copies.get(current) ?? songs[current].preview;
    // Start buffering now, while the disc is being put on, instead of on play.
    audio.preload = "auto";
    warm(current);
    warm(current + 1);
    bar.style.transform = "scaleX(0)";
    elapsed.textContent = "0:00";
    const url = new URL(window.location.href);
    url.searchParams.set("song", songs[current].id);
    history.replaceState(null, "", url);
    if ("mediaSession" in navigator) {
      const song = songs[current];
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album,
        artwork: [{ src: song.cover, sizes: "400x400", type: "image/webp" }],
      });
    }
    if (deck) {
      loaded = -1;
      deck.setPlaying(false);
      deck.request(current);
    } else {
      loaded = current;
      if (wantsPlay) start();
    }
    render();
  }

  rows.forEach((row, i) => {
    row.addEventListener("pointerenter", () => warm(i));
    row.addEventListener("focus", () => warm(i));
  });
  root.querySelector("[data-next]")!.addEventListener("pointerenter", () => warm(current + 1));
  root.querySelector("[data-prev]")!.addEventListener("pointerenter", () => warm(current - 1));

  rows.forEach((row, i) =>
    row.addEventListener("click", () => {
      if (i === current && loaded === current) {
        if (audio.paused) start();
        else audio.pause();
        return;
      }
      choose(i, true);
    }),
  );
  toggle.addEventListener("click", () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    wantsPlay = true;
    if (loaded === current) start();
    render();
  });
  root.querySelector("[data-prev]")!.addEventListener("click", () => choose(current - 1, true));
  root.querySelector("[data-next]")!.addEventListener("click", () => choose(current + 1, true));

  audio.addEventListener("play", () => {
    deck?.setPlaying(true);
    render();
  });
  audio.addEventListener("pause", () => {
    deck?.setPlaying(false);
    render();
  });
  audio.addEventListener("ended", () => choose(current + 1, true));
  audio.addEventListener("timeupdate", () => {
    const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 30;
    bar.style.transform = `scaleX(${Math.min(1, audio.currentTime / duration)})`;
    elapsed.textContent = clock(audio.currentTime);
    deck?.setTime(current, audio.currentTime, duration);
  });

  if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("previoustrack", () => choose(current - 1, true));
    navigator.mediaSession.setActionHandler("nexttrack", () => choose(current + 1, true));
  }

  const asked = new URL(window.location.href).searchParams.get("song");
  const first = Math.max(0, songs.findIndex((song) => song.id === asked));
  // Show the asked song straight away; the page was built with the first one.
  current = first;
  render();
  warm(first);

  return {
    /** Hand the player the deck once it is up; the first disc goes on straight away. */
    attach(next: Turntable | null) {
      deck = next;
      choose(first, true);
    },
    onLoaded(index: number) {
      loaded = index;
      if (index === current && wantsPlay) start();
      render();
    },
  };
}
