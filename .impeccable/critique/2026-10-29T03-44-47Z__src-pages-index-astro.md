---
target: whole portfolio (home, projects, blog; en+fr)
total_score: 16
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
target_identity: "file:/home/gedeon/PROGRAMMING_COURSES/Nextjs/newportfolio/astro-portfolio/src/pages/index.astro"
target_fingerprint: "sha256:80827b8a7a0ecb9535a7468a1718675cb5bbd60e22a3a98b7c2e8b80590bcb8f"
target_path: /home/gedeon/PROGRAMMING_COURSES/Nextjs/newportfolio/astro-portfolio/src/pages/index.astro
timestamp: 2026-10-29T03-44-47Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design review · B: detector + CDP audit) + taste-skill review (C)

## Design Health Score — 16/32 (50%, Acceptable)
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Fixed 1.8s full-screen loader on every page; "Sent ✓" vanishes after 3s |
| 2 | Match System / Real World | 2 | "Joel CODJA(K-O-J-A)" in H1; Benin text vs Gabon badge |
| 3 | User Control and Freedom | 1 | Project modal: no close button, no Esc, no focus return |
| 4 | Consistency and Standards | 2 | Dock = 1 anchor + 3 external links; Projects/Blog not in nav; #D97757 hardcoded 14x |
| 5 | Error Prevention | 2 | Missing EmailJS env vars => form always fails |
| 6 | Recognition Rather Than Recall | 3 | Labels visible; "+N" tags unrevealable |
| 7 | Flexibility and Efficiency | n/a | Portfolio surface |
| 8 | Aesthetic and Minimalist Design | 2 | Orphaned 👋 line, grey blog placeholders, 3 typefaces, 8 type sizes |
| 9 | Error Recovery | 2 | Error not announced, disappears in 3s, red-400 at 2.77:1 |
| 10 | Help and Documentation | n/a | Portfolio surface |

Audit: 10/20 (A11y 2, Perf 1, Theming 2, Responsive 3, Integrity 2)

## Design Specificity Verdict
Category-interchangeable 2024-25 dev-portfolio kit: 768px column, round avatar, "Hi, I'm X 👋", dot-grid, DM Serif + DM Mono + Inter, cream #F5F3EE + terracotta #D97757 (assistant-brand palette). Nothing signals "backend". Personal touches (Gabon flag badge, CJ loader, pronunciation) are buried or counterproductive.
Detector: src scan 1 (overused-font Inter, Layout.astro:55). URL scans: / 17, /390 21, /projects 10, /blog 8, /fr 16 — mostly low-contrast (accent 2.8-3.1:1), skipped-heading h1->h3 on /projects,/blog, cream-palette, 10px nav labels. Taste inspector: home 14 FAIL, /projects 9, /blog 11; lint 59 FAIL (mono, palette, emoji, shadow, gradient).

## Priority Issues
- [P0] Opaque SSR'd PageLoader hides every page for ~2-3s (PageLoader.tsx:7 setTimeout 1800, Layout.astro:72). Never clears if JS fails; ignores reduced motion. Fix: delete it. /impeccable optimize
- [P1] Site never proves backend skill: projects are frontend/portfolio, 2/3 blog posts Flutter, "3 years" vs one job Apr 2026. Fix: lead with Itaja/Lixali backend case studies (problem, architecture, stack, metric), concrete hero line, feature AES-256-GCM post, drop/fix portfolio card (claims Next.js 15 + heatmap). /impeccable shape then clarify
- [P1] Project cards mouse-only div onClick; modal lacks role=dialog, close, Esc, focus mgmt (ProjectCard.tsx:6-98). Fix: button trigger + native <dialog>. /impeccable harden
- [P1] Accent contrast fails: white on #D97757 3.1:1, accent text 2.8:1; form labels unlinked, errors not live, outline-none. Fix: darker accent ~#B5502F, tokenise, :focus-visible ring. /impeccable colorize + harden
- [P2] Hero identity: CODJA(K-O-J-A) glued, orphan 👋, Benin vs Gabon, leftover initials "AC"/company "Humanforce". /impeccable clarify + typeset
- [P2] Nav IA: dock omits Projects/Blog/Contact, duplicates footer socials, covers "Work Experience" at fold. Replace with top bar. /impeccable layout

## Technical
3.5MB me.png at 96px (LCP); site: yourportfolio.vercel.app placeholder in all og/hreflang; no canonical; identical titles; no prefers-reduced-motion; .reveal opacity:0 without JS; wrong alt text (Arduino/Auction); English posts on /fr without lang=en; dead code (Loader, GitHubSection, CSS, 6.7MB unused assets); undefined animate-fade-up/animate-wave.

## Persona Red Flags
Recruiter (30s): no stack/years/employer/project above fold; verdict "junior generalist". Casey: 1.8s loader each nav, 30px card buttons. Riley: env-var failure, Esc dead, unsorted blog. Jordan: dock items leave site.

## Art direction (taste-skill)
Recommended: "Type and nothing else" — one huge statement hero (Epilogue), charcoal/off-white/sage, projects as typographic index, live API request/response block as signature. Runner-up: "Name as monument".
