// What the pages need before deciding to load Three.js: kept apart from it so it stays out of the
// first bundle.

export interface SongData {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  url: string;
  preview: string;
  cover: string;
}

/** What the player drives: the 3D deck on a desktop, the flat CD on a phone. */
export interface Turntable {
  request(index: number): void;
  setPlaying(on: boolean): void;
  setTime(index: number, seconds: number, duration: number): void;
}

/** WebGL can be missing or blocked; callers keep their plain HTML version when this is false. */
export function canRender() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function readSongs(root: HTMLElement): SongData[] {
  try {
    return JSON.parse(root.dataset.songs ?? "[]") as SongData[];
  } catch {
    return [];
  }
}
