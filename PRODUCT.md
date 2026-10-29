# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Recruiters and hiring managers** filling backend roles (often remote). They skim for under a minute and need to answer: is this a real backend engineer, what has he shipped, how do I reach him.
- **The developer community** reading Joel's blog posts and following his open-source work. They come for an article or a repo and stay if the work is credible.

## Product Purpose

The personal site of Joel Codja, a backend developer. It exists to prove backend skill with shipped work and to make contact easy. Success: a recruiter leaves knowing what he built and how to reach him; a developer finds a post or project worth reading.

## Positioning

Joel is Gabonese, based in Cotonou, Benin. He builds MakiSend (open-source transactional email on Cloudflare) at Lixali Studio and his own open-source linkedin-scheduler. The site shows that work as engineering (requests, architecture, numbers), not as a generic "I build APIs" claim. Itaja is not shown (Joel's decision, 2026-10-29).

## Operating Context

- Bilingual: English (default, `/`) and French (`/fr/`), every page in both.
- Blog posts come from Hashnode (`src/lib/hashnode.ts`) and are written in English.
- Contact goes through EmailJS (`src/components/ContactForm.tsx`).
- A "where I am" block reads Joel's own API, GET /api/where (a Cloudflare Pages Function in functions/api/where.ts): city, country, local time, city-centre coordinates and live weather from Open-Meteo, shown on an OpenStreetMap map.
- A short cinematic opening title ("I AM THE ONE", then the c/J mark) plays once per browser session; skippable, off under reduced motion.

## Capabilities and Constraints

- Astro static site with React islands.
- Location API: **city level only** (city, country, timezone, city-centre coordinates rounded to two decimals, weather). Never an address, a precise position, or anything that tracks movement.
- Domain: **undecided** (Joel plans to buy one after the redesign). Keep it in one constant; never invent a URL.
- A "passions" section (music, wrestling, and more) is planned later; content not yet provided.

## Brand Commitments

- Name: Joel Codja, pronounced "ko-ja" (/ko.dʒa/). The pronunciation is part of the identity.
- Origin: from Gabon, lives in Cotonou, Benin. Say it once, in words.
- Visual system follows MakiSend's `DESIGN.md` (Arc UI), with Joel's terracotta accent instead of MakiSend green.
- The c/J monogram (Backend/social/linkedin/template/cj-mark*.svg) is Joel's mark across his work: header, favicon, opening title.
- Portrait: Joel's ink engraving among palm trees (src/assets/portrait-engraving.webp), not a photograph.

## Evidence on Hand

- **MakiSend** (his work): self-hosted transactional email on Cloudflare Workers. Facts from `../../Backend/makisend-website/src/lib/site.ts`: any SMTP provider, AES-256 encryption at rest in D1, 300 to 400 ms at best and about 2 s at worst, three retries 30 s apart, dead-letter queue, React Email templates, TOTP 2FA. Repo: github.com/lixalistudio-oss/makisend. Site: makisend.lixalistudio.tech.
- **linkedin-scheduler** (his own, open source): Markdown posts published on schedule by cron through LinkedIn's official API; never posts twice (ledger, publishing state, lock); renders 1080×1350 cards; --check and --dry-run. github.com/cjdotdev/linkedin-scheduler, linkedin-scheduler.makisend-poc.workers.dev. Facts from ../../Backend/linkedin-scheduler/README.md.
- **Contrasto**: WCAG contrast checker (github.com/alpha1207vj/CHECKERCONTRASTOWCAG, codja.vercel.app).
- **Experience**: Lixali Studio, backend developer, Apr 2026 to present.
- **Writing**: Hashnode posts, including one on AES-256-GCM in Node.js.
- Absent, do not fabricate: usage numbers, testimonials, employer logos, a CV file.

## Product Principles

1. Show the work as engineering: a request, a response, an architecture, a real number.
2. Every claim must be true and checkable; cut anything stale or unverifiable.
3. A recruiter gets who, what and how-to-contact in the first screen.
4. Both languages are first-class; nothing renders half-translated.
5. Personal, not generic: the name, the pronunciation and the Gabon-to-Cotonou story belong to Joel.

## Accessibility & Inclusion

WCAG 2.1 AA: text contrast 4.5:1, keyboard-operable everything, visible focus, reduced-motion alternatives, correct `lang` on English content inside French pages.
