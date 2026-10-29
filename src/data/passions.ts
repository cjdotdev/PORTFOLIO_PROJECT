// ─── Off the clock ─────────────────────────────────────────────────
// What Joel watches, plays and listens to. Facts come from Joel; the two older G1 finals were checked.
// Copy that changes with the language lives in src/i18n (passions).

/** Photos from Wikimedia Commons, cropped to 4:5 WebP in public/img/wrestlers/<id>-v<version>.webp. */
export interface Wrestler {
  id: string;
  name: string;
  /** Bump with the file name when the photo changes: /img is cached for a year. */
  version?: number;
  credit: { author: string; license: string; licenseUrl: string; source: string };
}

const BY_SA_2 = "https://creativecommons.org/licenses/by-sa/2.0/";
const BY_SA_3 = "https://creativecommons.org/licenses/by-sa/3.0/";
const BY_SA_4 = "https://creativecommons.org/licenses/by-sa/4.0/";
const BY_3 = "https://creativecommons.org/licenses/by/3.0/";
const BY_2 = "https://creativecommons.org/licenses/by/2.0/";
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const WRESTLERS: Record<string, Wrestler> = {
  kojima: { id: "kojima", name: "Satoshi Kojima", version: 2, credit: { author: "Yuzunet", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("20230122cozy1.jpg") } },
  oiwa: { id: "oiwa", name: "Ryohei Oiwa", credit: { author: "結牙", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Ryohei_Oiwa_20260816.jpg") } },
  uemura: { id: "uemura", name: "Yuya Uemura", credit: { author: "結牙", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Yuya_Uemura_20260816_(cropped).jpg") } },
  tsuji: { id: "tsuji", name: "Yota Tsuji", credit: { author: "結牙", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Yota_Tsuji_20250105_(cropped).jpg") } },
  tanahashi: { id: "tanahashi", name: "Hiroshi Tanahashi", version: 2, credit: { author: "ゾーヒョー", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Hiroshi_Tanahashi_2016.jpg") } },
  nagata: { id: "nagata", name: "Yuji Nagata", credit: { author: "ゾーヒョー", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Yuji_Nagata_Aug_2015.JPG") } },
  omega: { id: "omega", name: "Kenny Omega", credit: { author: "ゾーヒョー", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Kenny_Omega_IWGP_Intercontinental_Champion.jpg") } },
  goto: { id: "goto", name: "Hirooki Goto", credit: { author: "ゾーヒョー", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Hirooki_Goto_2016.JPG") } },
  okada: { id: "okada", name: "Kazuchika Okada", credit: { author: "ゾーヒョー", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Kazuchika_Okada_2016.JPG") } },
  ospreay: { id: "ospreay", name: "Will Ospreay", credit: { author: "JJ Williams, Wrestling Observer Newsletter", license: "CC BY 3.0", licenseUrl: BY_3, source: commons("Will_Ospreay,_AEW_Revolution_2024_(cropped).jpg") } },
  naito: { id: "naito", name: "Tetsuya Naito", credit: { author: "ゾーヒョー", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Tetsuya_Naitō_2016.JPG") } },
  misawa: { id: "misawa", name: "Mitsuharu Misawa", credit: { author: "The Doppelganger", license: "CC BY-SA 3.0", licenseUrl: BY_SA_3, source: commons("Mitsuharu_Misawa,_2007.jpg") } },
  ibushi: { id: "ibushi", name: "Kota Ibushi", credit: { author: "ゾーヒョー", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Kota_Ibushi_Aug_2015.JPG") } },
  takagi: { id: "takagi", name: "Shingo Takagi", credit: { author: "Hirondon", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("SHINGO_TAKAGI_2020.02.20.jpg") } },
  hiromu: { id: "hiromu", name: "Hiromu Takahashi", credit: { author: "Hirondon", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Hiromu_Takahashi_2020.02.19.jpg") } },
  ishii: { id: "ishii", name: "Tomohiro Ishii", credit: { author: "ゾーヒョー", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Tomohiro_Ishii_2016.JPG") } },
  shibata: { id: "shibata", name: "Katsuyori Shibata", credit: { author: "ゾーヒョー", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Katsuyori_Shibata_2015.jpg") } },
  liger: { id: "liger", name: "Jushin Thunder Liger", credit: { author: "OKfarm", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Jushin_Thunder_Liger_2019_nakayama_(cropped).jpg") } },
  kawada: { id: "kawada", name: "Toshiaki Kawada", credit: { author: "Andrew Quentin", license: "CC BY-SA 2.0", licenseUrl: BY_SA_2, source: commons("Toshiaki_Kawada_and_Zeus_shaking_hands_crop.jpg") } },
  akiyama: { id: "akiyama", name: "Jun Akiyama", credit: { author: "All Elite Wrestling", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Jun_Akiyama,_2022_(cropped).jpg") } },
  moxley: { id: "moxley", name: "Jon Moxley", credit: { author: "Dante Luna", license: "CC BY 3.0", licenseUrl: BY_3, source: commons("Jon_Moxley_Oct_2019_(cropped).jpg") } },
  danielson: { id: "danielson", name: "Bryan Danielson", credit: { author: "Ralph Arvesen", license: "CC BY-SA 2.0", licenseUrl: BY_SA_2, source: commons("Bryan_Danielson_2022-03-23_(cropped).jpg") } },
  page: { id: "page", name: "Hangman Adam Page", credit: { author: "Super Festivals", license: "CC BY 2.0", licenseUrl: BY_2, source: commons("Adam_Page,_July_2022_2_(headshot).jpg") } },
  swerve: { id: "swerve", name: "Swerve Strickland", credit: { author: "JDC808", license: "CC BY-SA 4.0", licenseUrl: BY_SA_4, source: commons("Swerve_Strickland_at_AEW_Dynamite-_April_10,_2024.jpg") } },
  kobashi: { id: "kobashi", name: "Kenta Kobashi", credit: { author: "shawnsavior", license: "CC BY-SA 2.0", licenseUrl: BY_SA_2, source: commons("Kenta_Kobashi,_2007.jpg") } },
};

export const wrestlerPhoto = (id: string) => `/img/wrestlers/${id}-v${WRESTLERS[id]?.version ?? 1}.webp`;

/** The G1 Climax matches Joel picked, oldest first. `note` keys into the dictionary. */
export interface Match {
  year: number;
  edition: string;
  final: boolean;
  left: string;
  right: string;
  note: "firstTana" | "firstForeigner" | "favorite";
}

export const MATCHES: Match[] = [
  { year: 2007, edition: "G1 Climax 17", final: true, left: "tanahashi", right: "nagata", note: "firstTana" },
  { year: 2016, edition: "G1 Climax 26", final: true, left: "omega", right: "goto", note: "firstForeigner" },
  { year: 2026, edition: "G1 Climax", final: false, left: "oiwa", right: "uemura", note: "favorite" },
  { year: 2026, edition: "G1 Climax", final: false, left: "uemura", right: "tsuji", note: "favorite" },
];

/**
 * The scrolling roster: 25, Japanese promotions and AEW only. The first 13 are Joel's own picks;
 * the last 12 were proposed for him to keep or swap.
 */
export const ROSTER = [
  "kojima", "oiwa", "okada", "ospreay", "naito", "tanahashi", "misawa", "kobashi", "nagata", "uemura", "tsuji", "goto", "omega",
  "ibushi", "takagi", "hiromu", "ishii", "shibata", "liger", "kawada", "akiyama", "moxley", "danielson", "page", "swerve",
];

export interface Song {
  title: string;
  artist: string;
  album: string;
  year: number;
  /** The track on Apple Music (from the iTunes Search API, October 2026). */
  url: string;
  /** Apple's official 30-second preview, played on the turntable when a cover is clicked. */
  preview: string;
  /** Album artwork from Apple Music, 400px WebP in public/img/music. */
  cover: string;
}

/**
 * Asake first, then the rest of what Joel's girlfriend got him into. Albums, years and links are the
 * versions in Apple Music's catalogue (October 2026).
 */
export const SONGS: Song[] = [
  { title: "Remember", artist: "Asake", album: "Work of Art", year: 2023, url: "https://music.apple.com/us/album/remember/1688641478?i=1688642490", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ae/d1/f5/aed1f575-1624-1414-b4b0-666e4eb1e4cf/mzaf_16514113868838400487.plus.aac.p.m4a", cover: "/img/music/remember-v1.webp" },
  { title: "Peace Be Unto You", artist: "Asake", album: "Mr. Money With The Vibe", year: 2022, url: "https://music.apple.com/us/album/peace-be-unto-you-pbuy/1636748658?i=1636748680", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/32/2f/43/322f435b-b7ec-819b-0929-b5ce3e5a3f5c/mzaf_9904301643496508192.plus.aac.p.m4a", cover: "/img/music/peace-be-unto-you-v1.webp" },
  { title: "Oba", artist: "Asake", album: "M$NEY", year: 2026, url: "https://music.apple.com/us/album/oba/1891869190?i=1891869461", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b5/3e/52/b53e5276-2bf2-1375-427d-6890f7473399/mzaf_3940828430347965706.plus.aac.p.m4a", cover: "/img/music/oba-v1.webp" },
  { title: "Lonely At The Top", artist: "Asake", album: "Work of Art", year: 2023, url: "https://music.apple.com/us/album/lonely-at-the-top/1688641478?i=1688642838", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/af/79/fd/af79fdf3-e757-5acd-c0de-b5c6edfaa77a/mzaf_15402833629808241649.plus.aac.p.m4a", cover: "/img/music/lonely-at-the-top-v1.webp" },
  { title: "Unavailable", artist: "Davido feat. Musa Keys", album: "Timeless", year: 2023, url: "https://music.apple.com/us/album/unavailable-feat-musa-keys/1675379314?i=1675379749", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/af/5f/51/af5f5180-a71a-3677-e0c9-6dfbfa632f44/mzaf_7484682993874797646.plus.aac.p.m4a", cover: "/img/music/unavailable-v1.webp" },
  { title: "Electricity", artist: "Pheelz & Davido", album: "Pheelz Good EP", year: 2022, url: "https://music.apple.com/us/album/electricity/1662650825?i=1662651857", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8d/32/60/8d326032-e99f-8aaa-091a-162ebdbd7b35/mzaf_10101058134922772622.plus.aac.p.m4a", cover: "/img/music/electricity-v1.webp" },
  { title: "Fallin'", artist: "Alicia Keys", album: "Songs in A Minor", year: 2001, url: "https://music.apple.com/us/album/fallin/256936779?i=256937038", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/39/22/91/392291b5-39f1-8189-3a9b-924361e70776/mzaf_5017281125172140671.plus.aac.p.m4a", cover: "/img/music/fallin-v1.webp" },
  { title: "Hips Don't Lie", artist: "Shakira feat. Wyclef Jean", album: "Oral Fixation, Vol. 2", year: 2005, url: "https://music.apple.com/us/album/hips-dont-lie-feat-wyclef-jean/1817217057?i=1817217063", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ac/c7/61/acc7619f-c1e3-e0a5-df9b-0329a35af062/mzaf_13106936727189536738.plus.aac.p.m4a", cover: "/img/music/hips-don-t-lie-v1.webp" },
  { title: "Glamorous", artist: "Fergie feat. Ludacris", album: "The Dutchess", year: 2006, url: "https://music.apple.com/us/album/glamorous-feat-ludacris/1619001614?i=1619001760", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/59/98/3f/59983f85-8028-095d-7731-42f3b921ff29/mzaf_12539915369354398032.plus.aac.p.m4a", cover: "/img/music/glamorous-v1.webp" },
  { title: "Big Poppa", artist: "The Notorious B.I.G.", album: "Ready to Die", year: 1994, url: "https://music.apple.com/us/album/big-poppa/204669415?i=204669732", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a7/67/9e/a7679ee9-f358-dd4d-f6bc-85cb6b2d39da/mzaf_555885344151662906.plus.aac.p.m4a", cover: "/img/music/big-poppa-v1.webp" },
  { title: "Hit 'Em Up", artist: "2Pac", album: "Greatest Hits", year: 1998, url: "https://music.apple.com/us/album/hit-em-up/1440661662?i=1440661926", preview: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2b/d5/7b/2bd57b22-f7c7-aa74-f09d-03691390b8ff/mzaf_16067229147945979824.plus.aac.p.m4a", cover: "/img/music/hit-em-up-v1.webp" },
];

export interface Game {
  id: "fpww" | "sfa3";
  name: string;
  /** The store or official page the card links to. */
  url: string;
  owner: string;
}

/** Artwork: Steam store assets for Fire Pro (app 564230), the 1998 arcade flyer for Alpha 3 (Wikipedia). */
export const GAMES: Game[] = [
  { id: "fpww", name: "Fire Pro Wrestling World", url: "https://store.steampowered.com/app/564230/", owner: "Spike Chunsoft" },
  { id: "sfa3", name: "Street Fighter Alpha 3", url: "https://en.wikipedia.org/wiki/Street_Fighter_Alpha_3", owner: "Capcom" },
];
