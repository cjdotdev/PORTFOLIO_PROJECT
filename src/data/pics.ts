/**
 * The Pics page: Joel's own photographs, converted from the camera's WebP by Claude Code and laid
 * out in the bento grid of src/sections/PicsPage.astro. Widths are the shipped files in
 * public/img/pics (1600 landscape, 1200 portrait); `span` is how many of the desktop grid's twelve
 * columns the photo takes, chosen so tall and wide frames alternate and every row fills.
 */
export interface Pic {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Columns out of twelve on desktop: 4, 6 or 8. */
  span: 4 | 6 | 8;
}

const L = () => ({ width: 1600, height: 1200 });
const P = () => ({ width: 1200, height: 1600 });

export const PICS: Pic[] = [
  { id: "photo-01", src: "/img/pics/photo-01.webp", ...L(), alt: "Two people riding a red motorcycle down a sunny street", span: 8 },
  { id: "photo-02", src: "/img/pics/photo-02.webp", ...P(), alt: "Stone lion statues at a temple gate", span: 4 },
  { id: "photo-03", src: "/img/pics/photo-03.webp", ...L(), alt: "A white building with a red pagoda roof", span: 4 },
  { id: "photo-04", src: "/img/pics/photo-04.webp", ...P(), alt: "A palm tree against a bright sky", span: 4 },
  { id: "photo-05", src: "/img/pics/photo-05.webp", ...L(), alt: "City lights at night, seen from above", span: 4 },
  { id: "photo-06", src: "/img/pics/photo-06.webp", ...L(), alt: "The city at night, lights along the road", span: 6 },
  { id: "photo-07", src: "/img/pics/photo-07.webp", ...L(), alt: "A night view over rooftops and streetlights", span: 6 },
  { id: "photo-08", src: "/img/pics/photo-08.webp", ...P(), alt: "A bottle of Coke on a table", span: 4 },
  { id: "photo-09", src: "/img/pics/photo-09.webp", ...L(), alt: "A street mural of two smiling soldiers", span: 4 },
  { id: "photo-10", src: "/img/pics/photo-10.webp", ...L(), alt: "A street mural of an elephant", span: 4 },
  { id: "photo-11", src: "/img/pics/photo-11.webp", ...P(), alt: "A street mural of a lion's face", span: 4 },
  { id: "photo-12", src: "/img/pics/photo-12.webp", ...P(), alt: "A masquerade figure in a bright costume", span: 4 },
  { id: "photo-13", src: "/img/pics/photo-13.webp", ...L(), alt: "Women carrying goods at a market", span: 4 },
  { id: "photo-14", src: "/img/pics/photo-14.webp", ...P(), alt: "A smiling selfie in a cap", span: 4 },
  { id: "photo-15", src: "/img/pics/photo-15.webp", ...P(), alt: "A hand holding up a brown cap", span: 8 },
  { id: "photo-16", src: "/img/pics/photo-16.webp", ...P(), alt: "A hand holding a black keyboard", span: 8 },
  { id: "photo-17", src: "/img/pics/photo-17.webp", ...P(), alt: "A smiling selfie in a doorway", span: 4 },
];
