# CLAUDE.md

Joel Codja's personal site: a backend developer from Gabon, based in Cotonou. Astro 7, static, bilingual
(English at `/`, French at `/fr/`), deployed on Cloudflare Pages. Work happens on the `redesign` branch.

## Commands

```bash
pnpm dev        # astro dev
pnpm lint       # eslint .        ┐
pnpm check      # astro check     ├ CI runs all three; run them before any push
pnpm build      # astro build     ┘
pnpm preview    # serves dist/ (use a port, e.g. `npx astro preview --port 4329`, and stop it after)
```

## Deploy

- `.github/workflows/deploy.yml` deploys to Cloudflare Pages (project `joelcodja`) **only on a push to
  `main`**: lint, check, build, then `wrangler pages deploy`.
- `redesign` is ahead of `main` with no divergence, so deploying is `git push origin redesign:main`
  (fast-forward). Pushing to `main` puts the site in production: ask Joel before doing it.
- `functions/api/where.ts` is a Pages Function (`GET /api/where`). It does not exist under `astro dev`;
  the page falls back to `LOCATION` and fetches the weather from Open-Meteo directly.

## Where things are

| Path | What |
|---|---|
| `src/pages/*.astro`, `src/pages/fr/*.astro` | Thin routes; each renders a section with the locale's dictionary |
| `src/sections/` | Page bodies: `Home`, `ProjectsPage`, `BlogPage`, `KojimaStory`, `MusicPage`, `PicsPage` |
| `src/i18n/en.ts`, `fr.ts` | All copy. Every string exists in both; `Dict` is typed from `en.ts` |
| `src/data/index.ts` | Facts: `PERSONAL`, `LOCATION`, `PROJECTS`, `EXPERIENCE`, `SITE_URL` |
| `src/data/tech.ts` | Generated one-colour SVG marks for the tech lists (Simple Icons, Lucide) |
| `src/data/gabon.ts` | Generated Gabon map: 9 provinces (geoBoundaries, CC BY-SA 3.0) and 11 towns (Wikidata) |
| `src/data/cj-mark.ts` | Geometry of the CJ mark |
| `src/styles/global.css` | Tokens and base styles on top of `src/components/arc/foundation.css` (Arc UI) |
| `public/video/` | Project demo loops, **WebM only**, 720p VP9, plus `*-poster.webp` |
| `public/projects/` | Project logos (square SVGs) |
| `public/img/` | `intro-hand-v1.webp` (quill hand), `hand-take.webp` (deck hand) |

`src/components/ProjectsShowcase.astro` is the old staircase version of the projects section. It is no
longer used (kept until Joel says to delete it).

## Design rules (pinned by Joel)

- **Dark only.** No light theme, no theme toggle.
- One accent: terracotta `#e8916f` (dark value). Arc UI rules: weights 400 and 500 only, sentence case,
  no eyebrow labels above headings, no em dashes in copy, no decorative glows or gradients.
- Fonts: Clash Grotesk (display), Cabinet Grotesk (body), Geist Mono, Monoton for the CODJA wordmark.
- Icons: Lucide (the set Arc uses), inlined as SVG with a 1.75 stroke. Do not pull in the React Arc
  components (they need `motion`) for static things; reproduce their look in CSS.
- `DESIGN.md` is out of date (still describes Geist/Inter, light mode, the old c/J mark). Trust the code.
- Never show Itaja. Shipped projects: MakiSend (built at Lixali Studio), linkedin-scheduler, Contrasto.
  In progress: zeroknowledge (a 1time.io-style one-time secret link) and `pulse` (a made-up placeholder).
- Copy Joel will read as his voice: propose several phrasings and let him choose. Placeholder facts are
  marked `TODO(Joel)` in `src/data/index.ts` (delivered dates, pulse).

## How the main pieces work

**Intro** (`Intro.astro`): once per session (`sessionStorage["joelcodja.intro"] = "seen"`), skippable.
Its engraved quill hand is the site's signature; do not reuse it for other gestures.

**Projects deck** (`ProjectDeck.astro`, `CardBack.astro`): one component, one DOM, two arrangements
picked by `matchMedia("(max-width: 39.99rem)")` and written to `data-mode`:
- `deck` (tablet and desktop): cards lie in perspective (`.deck` is `translate(-50%,-50%) rotateX(55deg)
  rotateZ(-35deg)`). Clicking the top card brings `hand-take.webp` (Goltzius plate c. 1610, Rijksmuseum,
  CC0) that lifts it upright; its video plays and the side panel opens. Clicking the drawn card turns it
  over slowly (its back shows), then slips it under the deck. Only clicks move the deck: no scroll
  driving, no previous/next buttons (Joel rejected both).
- `phone`: a standing pile. A swipe either way sends the top card round to the back (it turns over on
  the way); a tap plays its demo; the panel always shows the top card. The hand is never downloaded.
- Poses are built by `pose()` / `flat()` with the same function list in every keyframe, so the Web
  Animations API interpolates number by number.
- The drawn card is placed 40px under the section heading, computed from the table centre (the deck's
  real centre), not from the deck's on-screen box, which the tilt skews.
- In-progress projects (`status` in `PROJECTS`) get a CSS construction face, a Lucide status badge and
  "Planned for" instead of "Shipped"; `/projects` lists shipped projects only.
- `/projects` is **hidden, not deleted** (`PROJECTS_PAGE = false` in `src/data/index.ts`): it repeated
  the deck. Nothing links to it, it is `noindex`, and the "All projects" button and the header's
  "Projects" link are not rendered (the same switch brings them back). Joel may bring it back with case
  studies; do not delete its files. The hero's second button is "Download my CV" (`PERSONAL.cv`).

**Tech lists** (`TechList.astro`): logo and name grid; on phones a list longer than six folds behind
"See more (+n)".

**Where I am right now** (`WhereAmI.astro`, `GabonMap.astro`): left, OpenStreetMap tiles of the current
city that follow `/api/where`, local time and weather; right, the Gabon map. Ntoum (Joel's town) is
chosen first and pulses; hover previews, click, tap or keyboard chooses.

**Header** (`Header.astro`, `LangSwitch.astro`): Lenis-style underline on links (draws in from the left,
leaves to the right), CJ mark centred, EN|FR switch on the right.

## Gotchas already paid for

- A closed menu panel that is only `opacity: 0` still takes clicks: hide it with `visibility: hidden` and
  `pointer-events: none` (this once broke the "All projects" link).
- Images inside a draggable card need `draggable="false"` and `pointer-events: none`, or the browser
  drags the image instead of the card.
- 3D: a card turning over inside a `preserve-3d` pile cuts through its neighbours; lift it by half its
  width times `sin(angle)` at each step (`turnOver()`), or use a flat pile ordered by `z-index`.
- `getBoundingClientRect()` of a tilted or perspective element is skewed; compute positions from layout.
- Attribute selectors must not collide (`[data-where]` once matched `data-where="place"` too).
- Douglas-Peucker on a closed ring needs the ring split in two (first point equals last).

## Checking work in a real browser

There is no Playwright install in this repo. Use `playwright-core` from
`../../../Backend/linkedin-scheduler/node_modules/playwright-core` with `/usr/bin/google-chrome`, against
`npx astro preview --port 4329`. Skip the intro with
`page.addInitScript(() => sessionStorage.setItem("joelcodja.intro", "seen"))`. Test at 390, 900 and
1440 px wide; for touch, send `Input.dispatchTouchEvent` through a CDP session. Stop the preview server
afterwards.

## Working with Joel

He writes in French and English, often quickly; answer in the language of his last message. Tell him
the plan before a big change, show results with screenshots, and say plainly what was not tested.
Commit only when asked; never push to `main` without his go-ahead.
