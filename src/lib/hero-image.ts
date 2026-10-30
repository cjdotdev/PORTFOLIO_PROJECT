/**
 * The hero engraving, served as static files so nothing is computed per request (dev or prod):
 * public/img/engraving-v1-{width}.webp, grayscale WebP. Bump "v1" when the drawing changes, because
 * the files are cached for a year (public/_headers).
 * Layout.astro preloads the same srcset and sizes so the browser starts the download before it has
 * read the CSS; the tiny blurred placeholder (288 bytes, inline) shows until the sharp file lands.
 */
const WIDTHS = [480, 720, 1000, 1400] as const;

/**
 * The photograph the engraving was drawn from, at the same framing and ratio, so the two line up
 * exactly. It shows through the drawing on hover, focus or tap (Hero.astro). Not preloaded.
 */
const PHOTO_WIDTHS = [480, 720, 1000] as const;

export const HERO_PHOTO = {
  src: "/img/portrait-photo-v1-720.webp",
  srcset: PHOTO_WIDTHS.map((w) => `/img/portrait-photo-v1-${w}.webp ${w}w`).join(", "),
};

export const HERO_IMAGE = {
  src: "/img/engraving-v1-1000.webp",
  srcset: WIDTHS.map((w) => `/img/engraving-v1-${w}.webp ${w}w`).join(", "),
  // On phones the image fills the width, but ink line art stays crisp below the screen's full
  // density: 80vw makes a 3x phone take the 1000px file and a 2x phone the 720px one.
  sizes: "(min-width: 48rem) min(44rem, 58vw), 80vw",
  width: 1400,
  height: 865,
  placeholder: "data:image/webp;base64,UklGRtAAAABXRUJQVlA4IMQAAABwBgCdASooABkAPuVapk2pJSOiNVv4ASAciWkADCZg06DhYbaq2rk9oqFgT7EL1pNfLFqmUEK0Q8Dx94AA/uIPT7HA/c6FKTnJ3o6HCZmtz2ouvKwIAlyi+ZEhhd3YS4fceXDjovGUN3y8IW43UmgOjLuhMPi81Z9V69wsGdibgiaAETe1F2NcO/rXG1WQ++a1h/bHcM7zhSgbgzieDQlsrPVHrmxsB9xsc0TFQj59HY0rVg71YFZ9xmLuu9+k45MQAAAA",
};
