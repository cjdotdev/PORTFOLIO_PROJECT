---
name: Joel Codja
description: Personal site of a backend engineer, built on Arc UI with MakiSend's system and a terracotta accent.
colors:
  terracotta: "#ae4b2b"
  terracotta-strong: "#8a3a1f"
  terracotta-subtle: "#f8ebe5"
  terracotta-dark: "#e8916f"
  terracotta-dark-strong: "#f4b79c"
  ink: "#151515"
  paper: "#ffffff"
  paper-muted: "oklch(97.8% 0 0)"
  text-secondary: "#5e5e5e"
  text-muted: "#6e6e6e"
  border: "#ebebeb"
  border-subtle: "#f4f4f4"
  border-strong: "#c7c7c7"
  night-background: "#1b1b1b"
  night-surface: "#222222"
  night-surface-muted: "#2c2c2c"
  night-foreground: "#f3f3f3"
  night-border: "#333333"
  success: "#0f7a3f"
  danger: "#c4282e"
typography:
  monument:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "calc(100cqi * 0.316)"
    fontWeight: 500
    lineHeight: 0.74
    letterSpacing: "-0.06em"
  display-lg:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "clamp(2.25rem, 1.4rem + 2.6vw, 3.25rem)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  display:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "clamp(1.75rem, 1.2rem + 1.8vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "clamp(1.5rem, 1.3rem + 0.6vw, 1.75rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  lede:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  label:
    fontFamily: "Inter Variable, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  mono:
    fontFamily: "Geist Mono Variable, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0em"
rounded:
  control: "18px"
  panel: "26px"
  surface: "34px"
  pill: "9999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "20px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "12": "48px"
  "16": "64px"
  gutter: "clamp(1rem, 0.6rem + 1.6vw, 2rem)"
  section: "clamp(4rem, 2.5rem + 6vw, 7.5rem)"
  page-max: "75rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "44px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
    height: "44px"
  nav-link-current:
    backgroundColor: "{colors.terracotta-subtle}"
    textColor: "{colors.terracotta-strong}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  icon-pill:
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.pill}"
    size: "44px"
  card-surface:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.surface}"
  footer-band:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
---

# Design System: Joel Codja

## Overview

**Creative North Star: "The Engineer's Letterhead"**

The site runs on MakiSend's system, pinned by the owner: Arc UI's neutral foundation, Geist for headings, Inter for reading, Geist Mono for data, weights 400 and 500 only, 18/26/34px corners, bordered surfaces without shadow, sentence case. Joel's terracotta replaces MakiSend green as the single accent. Everything is drawn from CSS custom properties; light and dark are two value sets on the same names, switched by `data-theme` on the root.

On top of that borrowed grammar the site adds a personal layer: the surname set as a full-width monument, the c/J monogram, an ink engraving portrait that sits on the page instead of in a frame, a live location board that shows the backend at work, a once-per-session cinematic title, and an inverted footer band. These additions carry identity; the system around them stays quiet so they read.

**Key Characteristics:**
- Neutral grey paper and ink, one terracotta accent used for links, live dots, focus and current state.
- Geist 500 headings with tight negative tracking, Inter 400 body, no other weights.
- Flat bordered surfaces at 18/26/34px; depth comes from borders and muted fills, not shadows.
- Identity carried by a few authored objects: monument, mark, engraving, location board.
- Motion is purposeful and gated on `prefers-reduced-motion`; content is visible by default.

## Colors

Achromatic Arc neutrals with one warm earth accent that shifts lighter in dark mode.

### Primary
- **Terracotta** (#ae4b2b light / #e8916f dark): links, live dots, the map pin, focus outline, selection, caret, `accent-color`. White on it is 5.5:1.
- **Fired Terracotta** (#8a3a1f light / #f4b79c dark): text of the current nav item, strong accent text.
- **Terracotta Wash** (#f8ebe5 light / terracotta at 14% in dark): background of the current nav item.

### Neutral
- **Ink** (#151515 light / #f3f3f3 dark): body text, primary button fill, the footer band.
- **Paper** (#ffffff light / #1b1b1b page and #222222 surface dark): page and surface.
- **Paper Muted** (oklch 97.8% light / #2c2c2c dark): image wells, map ground, response pane.
- **Secondary Grey** (#5e5e5e / #b9b9b9) and **Muted Grey** (#6e6e6e / #a3a3a3): supporting text and placeholders, both 4.5:1 or better.
- **Hairlines** (#ebebeb border, #f4f4f4 subtle, #c7c7c7 strong; dark #333333 / #2a2a2a / #4a4a4a): card borders, list rules, control outlines.
- **Status** (success #0f7a3f, danger #c4282e): form result messages only.

### Named Rules
**The One Ember Rule.** Terracotta is the only hue. It marks what is live, linked, focused or current; it is never a fill for large surfaces.

**The Token-Only Rule.** Components read custom properties; light and dark differ only in values on `:root[data-theme="dark"]`.

## Typography

**Display Font:** Geist Variable (sans-serif fallback)
**Body Font:** Inter Variable (sans-serif fallback)
**Label/Mono Font:** Geist Mono Variable (ui-monospace, SFMono-Regular, Menlo)

**Character:** A crisp grotesk for headings over a neutral reading face, with mono reserved for data and requests.

### Hierarchy
- **Monument** (500, `calc(100cqi * 0.316)`, line-height 0.74, -0.06em, uppercase): the surname CODJA only, filling the content width exactly.
- **Display Large** (500, clamp 2.25 to 3.25rem, 1.05, -0.035em): the hero headline.
- **Display** (500, clamp 1.75 to 2.25rem, 1.1, -0.03em): section headings.
- **Title** (500, clamp 1.5 to 1.75rem, 1.1): work item names; readout values at 1.375rem, -0.02em.
- **Lede** (400, 1.125rem, 1.4, max 38rem): intro paragraphs.
- **Body** (400, 1rem, 1.4, -0.01em).
- **Label** (500, 0.875rem): nav, buttons, field labels, captions.
- **Mono** (400, 0.8125rem, 1.6, tabular numerals): request lines and JSON.

### Named Rules
**The Two Weights Rule.** 400 and 500 only. Emphasis comes from size and colour, never bold.

**The Sentence Case Rule.** Headings, buttons and labels are sentence case. The monument is the single uppercase setting, because it is a name set as an object.

## Layout

Single centred column, `max-width: 75rem`, fluid gutter `clamp(1rem, 0.6rem + 1.6vw, 2rem)`. Sections pad `0.6 × clamp(4rem, 2.5rem + 6vw, 7.5rem)` top and bottom so two neighbours sum to 1.2. Spacing follows Arc's 4px-based scale. Two-column splits are asymmetric (5fr/7fr for work items, 7fr/5fr for the location board) and collapse to one column at 55rem and 60rem. The hero sizes against the viewport height (svh) so the monument closes a laptop's first screen; the portrait gives way in width to make that happen. Interactive targets are at least 44px.

## Elevation & Depth

Flat. Surfaces are separated by 1px borders and by muted fills (image wells, response pane), never by shadow. The only shadow on the site is the soft drop under the map pin (`0 2px 8px rgb(0 0 0 / 0.25)`), a map convention that lifts the marker off the tiles.

### Named Rules
**The Border Not Shadow Rule.** A container gets a 1px `--border` and a radius. Arc's shadow tokens exist in the foundation but are not used on surfaces.

## Shapes

Generous, consistent corners: 18px controls (buttons, inputs, nav items), 26px panels (readouts, screenshots on small screens), 34px surfaces (map, console, screenshots). Round icon buttons and status chips are full pills. The c/J mark is a circle with a diagonal slash, drawn in `currentColor`.

## Components

### Buttons
- **Shape:** gently rounded (18px), 44px tall, 0 20px padding, label 0.875rem/500.
- **Primary:** ink fill, paper text. One per surface.
- **Secondary:** paper fill, `--border-strong` outline, ink text; hover darkens the outline to ink.
- **Hover / Active:** primary mixes 14% toward the background; press scales to 0.98. Focus is a 2px terracotta outline offset 3px.

### Links
Terracotta text with a 1px underline at 35% accent, offset 0.22em; underline goes solid on hover.

### Cards / Containers
- **Corner Style:** 34px surfaces, 26px panels.
- **Background:** surface or surface-muted.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1px `--border`.
- **Internal Padding:** 20 to 24px.

### Inputs / Fields
- **Style:** 44px, 18px corners, 1px `--border-strong`, surface fill, 12px 16px padding; textarea 9rem minimum.
- **Focus:** border turns terracotta plus a 2px outline at 30% accent.
- **Status:** success and danger text under the form.

### Navigation
Header bar 72px tall: mark plus name on the left (mark rotates -12deg on hover with spring easing), links on the right in secondary grey at 0.875rem/500. Current page uses the terracotta wash with fired terracotta text. Language and theme toggles are 44px bordered pills; the theme icon cross-rotates sun and moon. Below 34rem labels drop.

### Monument
The surname spans the content column in a container query (`font-size: 100cqi × 0.316`), with an IPA pronunciation right-aligned under it. Letters rise from the baseline in sequence on first load (1s, 70ms stagger), visible by default.

### Engraving Portrait
An ink engraving placed with `mix-blend-mode: multiply` and a radial mask (`ellipse 62% 66% at 60% 50%`) so the paper dissolves into the page. In dark mode it is inverted (`invert(1) contrast(0.92)`, screen blend). Caption carries a pulsing terracotta live dot and local time.

### Location Board
A bordered map (34px) of OpenStreetMap tiles greyscaled (`grayscale(1) contrast(0.9) brightness(1.04)`, inverted in dark), a terracotta pin with a radar pulse, a readout strip (labels in secondary grey, values in Geist 500 tabular), and a request/response console: request line in mono, a secondary send button, and a muted response pane where JSON lines blur in.

### Opening Title
CSS-only, once per session, skippable: a terracotta flare, words landing in Geist 500 on near-black, the c/J mark drawing itself, then letterbox curtains parting at 2.75s as the monument rises.

### Footer Band
A hairline row with 44px round brand-icon links and a back-to-top link, then an inverted band (ink fill, paper text) carrying the name at full width and a legal line at 72% contrast.

## Do's and Don'ts

### Do:
- **Do** take every colour, radius, space and duration from the custom properties in `global.css` and `arc/foundation.css`.
- **Do** keep terracotta (#ae4b2b / #e8916f) to links, live dots, focus and current state.
- **Do** set headings in Geist 500 with negative tracking and body in Inter 400.
- **Do** use 1px borders and 18/26/34px corners for containers.
- **Do** gate every animation on `prefers-reduced-motion: no-preference` and leave content visible without it.
- **Do** keep touch targets at 44px.

### Don't:
- **Don't** use weights other than 400 and 500.
- **Don't** add shadows to cards or panels.
- **Don't** add eyebrows or kicker labels above headings.
- **Don't** use em dashes in copy.
- **Don't** set headings, buttons or labels in all caps; the monument is the only uppercase.
- **Don't** introduce a second accent hue.
