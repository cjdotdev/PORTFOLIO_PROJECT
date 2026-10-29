---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/projects.astro","src/pages/blog.astro"]
---

# Home (and /projects, /blog, /fr/*): surface brief

Scope: whole portfolio redesign. Mode: Persuade (recruiter) with Experience leanings (the name leads). Build path: code-led (no image generation on this machine).

Audience and job: a recruiter skimming for a backend engineer; a developer arriving from a post. Action: email Joel or open a case study. Proof: MakiSend and linkedin-scheduler facts (PRODUCT.md), a live call to Joel's own API (city, time, weather, map).

Constraints: visual system pinned by the user to MakiSend's DESIGN.md (Arc UI, Geist/Inter/Geist Mono, weights 400/500, 18/26/34 radii, bordered cards without shadow, sentence case, no eyebrow, no em dash) with Joel's terracotta as the accent. Direction pinned by the user: "name as monument". Location API is city-level only. Passions section deferred until content exists.

## Direction contract

THESIS: The surname is the architecture. CODJA is set as a monument across the full content width, and the page proves the engineer behind it with a real request to his own API. Refuses the centred avatar, "Hi, I'm X", two pills and a grid of cards.

OWN-WORLD: White ground, #151515 ink, #5e5e5e secondary, hairline #ebebeb borders, terracotta #AE4B2B only on links, the live dot and selected state; dark #1b1b1b with #E8916F. Geist 500 display at monument scale (0.316 of the content width, about 25vw at 1440) with tracking -0.06em so the five letters lock into one block, Inter body, Geist Mono only for the request, response and numbers. Bordered 26/34px panels, no shadows, no gradients.

STORY: A cinematic opening title once per session (I AM THE ONE, the c/J mark draws, curtains part); then who (Joel Codja, backend developer, from Gabon in Cotonou) and what (APIs, queues and the code that keeps them up) in one screen; then where he is right now, answered by his API; then the work as engineering; then writing; then a big email to write to; the page closes on CODJA again, full width on an inverted band (approved by the user in the plan: "Pied de page : CODJA revient en entier").

FIRST VIEWPORT: Top bar: c/J mark and name left; Projects, Writing, Contact, EN/FR and the theme switch right. Left column: one 52px Geist statement, one supporting line, primary near-black "Email me" plus secondary "See my projects". Right column: Joel's ink engraving, as large as the fold allows (width follows the viewport height), blended into the ground (multiply, edges dissolving; inverted in dark mode), with the live location caption and local time. Bottom edge: CODJA spanning the content width, its bottom inside the fold from 1024x768 to 1920x1080; the pronunciation /ko.dʒa/ · say ko-ja set small under it, right-aligned on the A.

FORM: Name as monument (taste-skill direction C), pinned by the user in words, so concept-seed was not run (a user-pinned direction beats the roll); no seed reference exists. Signature interaction: "Send request" replays GET /api/where, shows status and measured milliseconds, the JSON lands line by line, beside an OpenStreetMap map with a pulsing pin and live readouts (city, local time, weather, origin). Opening title: CSS-only, about 3.3 s, hard-cut words, film grain, letterbox, c/J mark drawn by stroke, curtains part; once per session, skippable, off under reduced motion; the monument rises as the curtains part. Motion grammar: one monument rise on load, scroll reveal from visible defaults, reduced-motion branch for both.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Final domain (Joel buys one after the redesign). SITE_URL constant points at the current Cloudflare Pages project until then.
- Passions section (music, wrestling) waits for content.
