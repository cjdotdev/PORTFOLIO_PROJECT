# CLAUDE.md

Joel Codja's personal site: a backend developer from Gabon, based in Cotonou. Astro 7, static, bilingual
(English at `/`, French at `/fr/`), deployed on Cloudflare Pages. Work happens on the `redesign` branch.

## At the start of every session

Load the three design skills Joel works with before touching anything visual:

1. **Impeccable**: the `impeccable:impeccable` skill.
2. **Taste skill**: the `taste-skill:design-taste-frontend` skill.
3. **UI Arc**: through the Arc MCP server, `get_skill` with `SKILL` first (then `checklist` before
   finishing; `design`, `copy`, `motion`, `responsive` and the others as needed).

The site is built on Arc's foundation (`src/components/arc/foundation.css`), so Arc's rules apply
everywhere; see "Design rules" below for where Joel has pinned or overridden them.

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
- Joel often commits himself; check `git log` before offering to commit.

## Where things are

| Path | What |
|---|---|
| `src/pages/*.astro`, `src/pages/fr/*.astro` | Thin routes; each renders a section with the locale's dictionary |
| `src/sections/` | Page bodies: `Home`, `ProjectsPage`, `BlogPage`, `KojimaStory`, `MusicPage`, `PicsPage` |
| `src/i18n/en.ts`, `fr.ts` | All copy. Every string exists in both; `Dict` is typed from `en.ts`. French uses "vous" |
| `src/data/index.ts` | Facts: `PERSONAL` (incl. `cv`), `PROJECTS`, `EXPERIENCE`, `SITE_URL`, page switches (`PROJECTS_PAGE`, `PICS_PAGE`, `KOJIMA_PAGE`, `MUSIC_PAGE`) |
| `src/data/tech.ts` | Generated one-colour SVG marks for the tech lists (Simple Icons, Lucide) |
| `src/data/cj-mark.ts` | Geometry of the CJ mark |
| `src/styles/global.css` | Tokens and base styles on top of `src/components/arc/foundation.css` (Arc UI) |
| `public/video/` | Project demo loops, **WebM only**, 720p VP9, plus `*-poster.webp`. Cached for a year: a changed video gets a new name (`-v2`) |
| `public/projects/` | Project logos (square SVGs) |
| `public/img/` | `intro-hand-v1.webp` (quill hand), `hand-take.webp` (deck hand), `about-build/takeover/connect.webp` (About engravings) |
| `public/cv/` | Does not exist yet: `TODO(Joel)` put `joel-codja-cv.pdf` there (the hero button links to it) |

Deleted by Joel's request (2026-11-02), do not look for them: `ProjectsShowcase`, `WhereAmI`,
`GabonMap`, `Passions`, `src/data/gabon.ts`, `LOCATION`, `functions/api/where.ts`, `src/lib/hashnode.ts`,
and the old `DESIGN.md`.

## Design rules (pinned by Joel)

- **Dark only.** No light theme, no theme toggle.
- One accent: terracotta `#e8916f` (dark value). Arc UI rules: weights 400 and 500 only, sentence case,
  no eyebrow labels above headings, no em dashes in copy, no decorative glows or gradients.
- **No cards, anywhere** (icon + title + text tiles, boxed grids). Joel was angry about it. Lists of
  services or items are typography: a sentence, rows with hairlines. The project deck is the one
  exception (literal playing cards, his idea).
- Fonts: Clash Grotesk (display), Cabinet Grotesk (body), Geist Mono, Monoton for CODJA (the Monoton
  file only has C, O, D, J, A).
- Icons: Lucide (the set Arc uses), inlined as SVG with a 1.75 stroke. Do not pull in the React Arc
  components (they need `motion`) for static things; reproduce their look in CSS.
- Illustrations are engravings in one style: public-domain prints (Rijksmuseum, CC0) turned into sepia
  line work (`#E9C9A2`, i.e. 233 201 162) on a transparent ground, edges dissolving. No AI images, no
  hand-drawn SVG. Check each print's maker and date with the museum before writing a credit.
- Never show Itaja. Shipped projects: MakiSend (built at Lixali Studio), linkedin-scheduler (Contrasto was
  removed). In progress, each with a concept trailer on its card (ids kept): `zeroknowledge` is
  **Supasecret** (1time.io-style one-time secret links, Hono on Cloudflare, blue, Nov 2026) and `pulse` is
  **Voctra** (a simple Thunder Client-style VS Code extension, TypeScript, no Hono or Cloudflare, red,
  Dec 2026). Their DESIGN.md and logos live in `../../../Backend/supasecret` and `../../../Backend/voctra`,
  their Remotion trailers in `Backend/supasecret-trailer` and `Backend/voctra-trailer` (node_modules is a
  link to linkedin-scheduler-trailer's). The card WebM comes from the `TrailerCard` composition (1440x810,
  so the scenes fill a small card), scaled to 1280x720.
- Copy Joel will read as his voice: propose several phrasings and let him choose. Keep it short (he
  finds long text heavy on phones). Placeholder facts are marked `TODO(Joel)` in `src/data/index.ts`.

## The home page, top to bottom

Hero → projects deck (`#work`) → What I can do for you (+ where I do it today) → Writing → Let's talk.
Joel removed "Where I am right now" and "Off the clock" (Kojima) from the home page (2026-10-31), then
had their components deleted (2026-11-02). Joel wants his work seen first.

**Hero** (`Hero.astro`): one sentence in two sizes, "Backend developer," large, then "specialised in
API design and serverless edge architectures." with the two specialties in terracotta (`[brackets]` in
the copy). No nickname, no slogan, no Lixali (it has its own row lower down). Line "From Gabon, based in
Cotonou.", buttons "Email me" and "Download my CV" (`PERSONAL.cv`, the PDF is still missing).

**What I can do for you** (`Home.astro`, `AboutStory.astro`): Joel's offer is exactly three phases,
**build** your backend from scratch, **take over** one that is slow, fragile or undocumented, **connect**
what you have to payments, email and outside APIs. Everything in this section explains one of them for
a client; nothing else (no technical layers, no request diagrams: both were rejected).
- Tablet and desktop: the engraving of the current phase is pinned on the left with the list
  "01 Build · 02 Take over · 03 Connect" under it; the phases scroll by on the right (number, title with
  the verb in terracotta, the situation, a short explanation, "What you get" as hairline rows). The
  current phase is computed from the scroll position (not an IntersectionObserver), so a jump or reload
  mid-page shows the right one. A new engraving wipes in from the left like ink.
- Phone: each phase shows its engraving above its text; "What you get" folds behind its label with a
  Lucide chevron (tap to open). The full phone design is still to do.
- Engravings: build, Officina Plantiniana printer's mark (hand from a cloud with a compass, RP-P-OB-6971,
  c. 1636); take over, Michael Snijders drawing-book plate (hand gripping a cord, RP-P-2009-677); connect,
  emblem of the Geuzen (handshake, RP-P-1886-A-10913, 1626). No visible credits (Joel's choice).
- Then "The tools I use" (`Stack.astro`, `STACK` in `src/data/index.ts`): four hairline rows, group
  and logos. Only tools a project proves; PostgreSQL, Redis, GraphQL, Express wait for Joel's word.
- Then "Where I do this today": one row between hairlines, the company large in terracotta on the left,
  the role and the dates vertically centred on it, the description under the role.

## How the main pieces work

**Intro** (`Intro.astro`): once per session (`sessionStorage["joelcodja.intro"] = "seen"`), skippable.
Its engraved quill hand is the site's signature: it writes the C here. No other gestures. No words: a line of
light, the hand writes the C, the J drops, the shadow builds, "JOEL" (small, tracked) over "CODJA"
(Monoton) writes itself, then the mark flies to the header. About 10.4 s.
- The opening line (0.35 s, just above the middle of the screen, `translate` 0.18 × `--mark`) is kept. Tried and rejected by Joel: an ink drop,
  a letterbox slam, a wax seal, and the surname spelled C-O-D-J-A as Monoton title cards. Do not
  propose them again.
- Keep the start light, phones stutter: animate only transform and opacity; the grain layer is only a
  little larger than the screen and fades in at 1.1 s; the page under the intro is `visibility: hidden`
  until the signature is written (`html[data-intro-reveal]`, set when the caret's animation ends).
- The flight is aimed again just before take-off (when the signature starts fading); aimed at load,
  it landed beside the header mark on phones.
- The hand is an `<img>` moved by Web Animations keyframes sampled from the same SVG paths, easings and
  start time as the ink, so it runs off the main thread.

**Projects deck, since 2026-11-01:** every width uses the standing pile (`data-mode="phone"`, the phone
version). Phones swipe; from 40rem two arrows sit under the pile, both always shown: → `sendBack(-1)`
(top card flies off turning over, slips behind), ← `bringBack(-1)` (the last card comes back on top
turning face up). The panel on the right always shows the top card (MakiSend first). One move at a
time (`busy()`). The table deck with the hand below is no longer used (its code is still there).

**Projects deck** (`ProjectDeck.astro`, `CardBack.astro`): one component, one DOM, two arrangements
picked by `matchMedia("(max-width: 39.99rem)")` and written to `data-mode`:
- `deck` (tablet and desktop): cards lie in perspective (`.deck` is `translate(-50%,-50%) rotateX(55deg)
  rotateZ(-35deg)`). Clicking the top card brings `hand-take.webp` (Goltzius plate c. 1610, Rijksmuseum,
  CC0) that lifts it upright; its video plays and the side panel opens. Clicking the drawn card turns it
  over slowly (its back shows), then slips it under the deck. No scroll driving. Desktop only (≥64rem),
  arrows under the deck (Joel asked for them on 2026-11-01, reversing his earlier no): → draws the next
  card, ← (shown once past the first card) puts the drawn card back under the deck as usual and brings the
  previous one onto the top beside the deck, then draws it (`drawPrevious()`). The card moves themselves
  are the original ones (Joel rejected a rework, 2026-11-01). One move at a time (`busy()`). On desktop the table's empty bottom strip
  (6rem) overlaps the section padding, so the gap to the next section matches the others.
- `phone`: a standing pile. A swipe either way sends the top card round to the back (it turns over on
  the way); a tap plays its demo; the panel always shows the top card. The hand is never downloaded.
- Poses are built by `pose()` / `flat()` with the same function list in every keyframe, so the Web
  Animations API interpolates number by number.
- The drawn card is placed 40px under the section heading, computed from the table centre (the deck's
  real centre), not from the deck's on-screen box, which the tilt skews.
- In-progress projects (`status` in `PROJECTS`) get a CSS construction face, a Lucide status badge and
  "Planned for" instead of "Shipped".
- `/projects` is shown (`PROJECTS_PAGE = true`): every project of the deck as a long row (screenshot, or
  the trailer for in-progress ones), with a "Home" link on top (`BackLink.astro`, also on `/blog`).
  `false` hides it again (no links, `noindex`) without deleting it.

**Tech lists** (`TechList.astro`): logo and name grid; on phones a list longer than six folds behind
"See more (+n)".

**Hidden pages**: `/pics` (`PICS_PAGE = false`, Joel is filling it), `/kojima` and `/music`
(`KOJIMA_PAGE`, `MUSIC_PAGE`): online but linked from nowhere, `noindex`, out of the sitemap.

**404** (`src/sections/NotFound.astro`, `src/pages/404.astro`, `src/pages/fr/404.astro`): Cloudflare
Pages serves the nearest `404.html` up the path; an integration in `astro.config.mjs` moves the French
one from `fr/404/index.html` to `fr/404.html` after the build.

**SEO**: `Layout.astro` writes title, description, canonical, hreflang (en, fr, x-default), Open Graph
(`public/og.png`, made from `scripts/og.html`; a post uses its cover), Person JSON-LD (BlogPosting on a
post), and the RSS link. `src/pages/sitemap.xml.ts` and `robots.txt.ts` are built from `SITE_URL`, the
page switches and the published posts. `joelcodja.com` is bought (Porkbun, 2026-11-02) but not connected yet, so the site still uses `joelcodja.pages.dev`; once Joel says it is live on Cloudflare, switch `SITE_URL` and `site` in `astro.config.mjs` together.

**Header** (`Header.astro`, `LangSwitch.astro`, `SocialIcons.astro`): Writing, (Pics), Contact on the
left with a Lenis-style underline (draws in from the left, leaves to the right), CJ mark centred,
GitHub and LinkedIn icons then the EN|FR switch on the right (in the phone sheet, under the switch).

**Let's talk** (`Contact.astro`): the address (plain), then the form as an API request
(`POST /joel/messages`, JSON keys as labels, `"subject"` = hire / project / hello, `//` comments in the
page's language) beside Mercury holding a letter (Queverdo, 1792 to 1798, RP-P-2024-74). Response
`201 Created` signed "Joel" by the quill, or `502` with the address. EmailJS keys must be GitHub
secrets for the deploy (`deploy.yml` passes them); test with `page.route("**/api.emailjs.com/**")`,
never send a real email.

**Footer finale** (after getitaja.com's footer: a giant wordmark rising out of layered hill bands as
the page scrolls to its end). Three versions to try, all with the giant Monoton CODJA, transform-only
scroll motion, and the quill signing "Joel" once it is up: A, engraved Atlantic waves (Libreville and
Cotonou's ocean); B, engraved ridges of the Estuaire hills (Ntoum's province); C, layers of spreading ink,
the quill writing CODJA itself. B was built and Joel preferred the old footer (CODJA band): kept as is.

**Writing** (`PostList.astro`, home and `/blog`): laid out after sanity.io/blog without its boxes: the
newest post featured full width (title large left, summary right), the rest in a 3/2/1-column grid,
each opened by a hairline, date and topics in mono at the foot. `/blog` adds topic filters. Posts are
bilingual since 2026-11-02 (below); a post shown in the other language is marked "In French" /
"En anglais" in terracotta.

**Blog posts** (`src/content/blog`, `src/content.config.ts`, `src/lib/posts.ts`, `src/sections/Article.astro`):
Joel writes Markdown on his computer and commits it; visitors only read. One post is `my-post.md`, or
a folder `my-post/index.md` with its images beside it; its French version is `my-post.fr.md` or
`my-post/index.fr.md` (same images). The name is the URL: `/blog/my-post/` and `/fr/blog/my-post/`.
Entries are keyed `en/<slug>` and `fr/<slug>`; `getPosts(locale)` in `src/lib/posts.ts` pairs them and
gives each language its version, or the other one when it is missing (the page then says "This post
only exists in French" / "Cet article n'existe qu'en anglais" and its canonical is the existing
version). Each version's tags are its own (Sécurité, Chiffrement...). The sitemap lists every version
with its twin; the RSS feed is the English list. Frontmatter: `title`,
`subtitle` (lists and meta description), `date`, optional `updated`, `tags`, optional `cover` (relative
path, about 1600x840) with `coverAlt` (required with a cover), `draft`. Drafts appear under `pnpm dev`
or a build with `SHOW_DRAFTS=true`, never in the deployed site. The first real post is
`aes-256-gcm-encryption-at-rest-in-nodejs` (the sample post was deleted, 2026-11-02): copy its frontmatter
to start one; `##` and `###` make the table of contents, `####` stays out of it. The post page, after
Hashnode: cover, title, subtitle, avatar (`public/img/avatar-v1.webp`), date and reading time, table of
contents (sticky on the right from 72rem, folded above the text below), Vesper-highlighted code with a
language bar and a copy button, `#` links on headings, topics (link to `/blog/?topic=...`), share
(copy link, X, LinkedIn), author box, previous and next post. `/rss.xml` lists the posts.

**Spacing**: one gap between any two sections, `--section-space` (0.6 × `--section`) at the top and
bottom of each; page heads use `.page-head`. Don't give a section its own padding-block.

**GitHub profile README** (repo `cjdotdev/cjdotdev`, cloned at `../cjdotdev`): the site's style as four
images in `assets/` (banner with the engraved portrait, the three phases, the project deck, the tools,
the CODJA band, and the link buttons drawn like the site's `.btn`), made from `scripts/github-profile.html`
by `node scripts/render-shots.mjs <playwright-core> scripts/github-profile.html ../cjdotdev/assets`.
The LinkedIn banner (EN and FR, 1584x396 at 2x) comes from `scripts/linkedin-banner.html` the same way
(page width 1584): the hero sentence in the middle (from x 540, clear of the profile photo, which covers
x < 500 from y 180 on desktop and phone), and Joel's engraved face on
the right in the engravings' sepia ink (an SVG colour-matrix filter on the hero engraving). Joel chose
the face over the quill hand with JOEL/CODJA (2026-11-02).
Freelance only (Joel, 2026-11-02). Update its links and the band's address when the domain goes live.

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
- Arc's foundation gives headings a margin (an `h4` had 26px above and below): reset it in components.
- A CSS animation keeps its timing function on its keyframes, not on its effect (read it with
  `getKeyframes()[0].easing`). An animation with `fill: both` shows its first keyframe before its delay.
- `pkill -f "port 4329"` in the same shell command kills that shell (exit 144) and skips what follows.
- Never `git stash` to compare before and after: new files are not stashed, and an interrupted command
  can leave the work stashed.
- Rijksmuseum: search `https://data.rijksmuseum.nl/search/collection?...` (Linked Art JSON-LD), images
  through IIIF `iiif.micr.io/<id>/full/max/0/default.jpg`; Python's default user agent is refused, send
  one. Wikimedia Commons has many Encyclopédie plates, filed by volume without trade names.

## Checking work in a real browser

There is no Playwright install in this repo. Use `playwright-core` from
`../../../Backend/linkedin-scheduler/node_modules/playwright-core` with `/usr/bin/google-chrome`, against
`npx astro preview --port 4329`. Skip the intro with
`page.addInitScript(() => sessionStorage.setItem("joelcodja.intro", "seen"))`. Test at 390, 900 and
1440 px wide; for touch, send `Input.dispatchTouchEvent` through a CDP session; for a real phone, use
`isMobile`, `hasTouch` and `deviceScaleFactor: 3`, and CPU throttling (`Emulation.setCPUThrottlingRate`)
to see stutter. Freeze an animation frame with `document.getAnimations()` (pause, set `currentTime`).
Stop the preview server afterwards. Static frames do not show smoothness: say so.

## Working with Joel

He writes in French and English, often quickly; answer in the language of his last message. Tell him
the plan before a big change, show results with screenshots, and say plainly what was not tested. When
he wants to see something, build it and show it rather than describing it. Commit only when asked; never
push to `main` without his go-ahead.
