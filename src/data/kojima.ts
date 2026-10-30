// ─── Satoshi Kojima, the story page (/kojima) ──────────────────────
// The photos are all from Wikimedia Commons under Creative Commons licences, converted to WebP in
// public/img/kojima/<id>-<width>.webp. The words live in src/i18n (kojima), the pictures here.
// Commons has no free photo of Kojima before 2010, so the early chapters show the people around him
// (his trainer, his opponents, his mentor), each captioned with who and when.

const BY_SA_3 = "https://creativecommons.org/licenses/by-sa/3.0/";
const BY_SA_4 = "https://creativecommons.org/licenses/by-sa/4.0/";
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file.replaceAll(" ", "_")}`;

export interface KojimaPhoto {
  /** Widths generated in public/img/kojima, smallest first. */
  widths: number[];
  /** Width over height of the original. */
  ratio: number;
  /** "full" fills the screen (large originals); "frame" stands as a portrait on the dark stage. */
  fit: "full" | "frame";
  /** object-position, so the crop keeps his face. */
  focus?: string;
  credit: { author: string; license: string; licenseUrl: string; source: string };
}

const BY_2 = "https://creativecommons.org/licenses/by/2.0/";
const BY_SA_2 = "https://creativecommons.org/licenses/by-sa/2.0/";
const BY_2_1_JP = "https://creativecommons.org/licenses/by/2.1/jp/deed.en";

const credit = (author: string, license: string, licenseUrl: string, file: string) => ({ author, license, licenseUrl, source: commons(file) });
const yuzunet = (file: string) => ({ author: "Yuzunet", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons(file) });
const zohyo = (file: string, license: "3.0" | "4.0" = "4.0") => ({
  author: "ゾーヒョー",
  license: `CC BY-SA ${license}`,
  licenseUrl: license === "3.0" ? BY_SA_3 : BY_SA_4,
  source: commons(file),
});

export const KOJIMA_PHOTOS = {
  cover: { widths: [800, 1600], ratio: 0.6667, fit: "frame", focus: "50% 20%", credit: yuzunet("20230122cozy2.jpg") },
  noah: { widths: [800, 1600], ratio: 0.6362, fit: "full", focus: "50% 18%", credit: yuzunet("20230122cozy1.jpg") },
  punk: {
    widths: [800, 1600],
    ratio: 2.5498,
    fit: "full",
    focus: "35% 50%",
    credit: { author: "Crisco 1492", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("CM Punk v Satoshi Kojima, AEW Forbidden Door 2023, 2023-06-25 05.jpg") },
  },
  lariat: { widths: [800, 1000], ratio: 1, fit: "full", focus: "45% 35%", credit: zohyo("Kojima Lariat.jpg") },
  cutter: { widths: [800, 1200], ratio: 1.3333, fit: "full", focus: "50% 40%", credit: zohyo("Kojima Cozy Cozy Cutter.jpg") },
  never: {
    widths: [800, 1200],
    ratio: 1.5,
    fit: "full",
    focus: "50% 30%",
    credit: zohyo("Satoshi Kojima, Ricochet and David Finlay NEVER Openweight 6-Man Tag Team Champions.jpg"),
  },
  g1: { widths: [430], ratio: 0.5972, fit: "frame", credit: zohyo("Satoshi Kojima2.JPG", "3.0") },
  iwgp: { widths: [600], ratio: 0.6667, fit: "frame", credit: zohyo("Satoshi Kojima IWGP Heavyweight Champion.jpg") },
  tencozy: { widths: [800], ratio: 1.3333, fit: "frame", credit: zohyo("TENCOZY.JPG", "3.0") },
  nwa: { widths: [800], ratio: 0.8, fit: "frame", credit: zohyo("TENKOJI NWA World Heavyweight Tag Team Champions.JPG", "3.0") },
  "tencozy-cutter": { widths: [800, 1200], ratio: 1.5, fit: "full", focus: "50% 45%", credit: zohyo("Tencozy Cutter.JPG") },
  robe: { widths: [650], ratio: 0.6842, fit: "frame", credit: zohyo("Satoshi Kojima 2015.JPG") },
  hamaguchi: {
    widths: [800, 1100],
    ratio: 1.1579,
    fit: "frame",
    credit: credit("椎林 隆夫", "CC BY-SA 3.0", BY_SA_3, "Hamaguchi Heigo, Japanese professional wrestler.jpg"),
  },
  nakanishi: { widths: [800, 1000], ratio: 0.7692, fit: "frame", credit: zohyo("Manabu Nakanishi 2015.JPG") },
  choshu: { widths: [704], ratio: 1.1373, fit: "frame", credit: credit("マ管", "CC BY 2.1 JP", BY_2_1_JP, "Riki Chōshū.jpg") },
  tenzan: { widths: [500], ratio: 0.7143, fit: "frame", credit: zohyo("Hiroyoshi Tenzan 2014.JPG", "3.0") },
  mutoh: { widths: [800, 1200], ratio: 0.9738, fit: "frame", credit: credit("Harry Li", "CC BY 2.0", BY_2, "Keiji Mutoh 2010.jpg") },
  voodoo: { widths: [800, 1200], ratio: 1.4679, fit: "full", focus: "50% 35%", credit: credit("Harry Li", "CC BY 2.0", BY_2, "Voodoo Murders.jpg") },
  takayama: { widths: [687], ratio: 0.6709, fit: "frame", credit: credit("siadowmoon", "CC BY-SA 2.0", BY_SA_2, "Yoshihiro Takayama 2009.jpg") },
} satisfies Record<string, KojimaPhoto>;

export type KojimaPhotoId = keyof typeof KOJIMA_PHOTOS;

export const kojimaSrc = (id: KojimaPhotoId, width: number) => `/img/kojima/${id}-${width}.webp`;

export function kojimaSrcset(id: KojimaPhotoId) {
  const photo: KojimaPhoto = KOJIMA_PHOTOS[id];
  return photo.widths.map((w) => `${kojimaSrc(id, w)} ${w}w`).join(", ");
}

/** The record at the end of the page: figures from his title history. */
export const KOJIMA_RECORD = {
  titles: 22,
  tripleCrown: 2,
  iwgp: 2,
  ghc: 1,
  nwa: 1,
  iwgpTag: 7,
  debut: "1991-07-16",
};
