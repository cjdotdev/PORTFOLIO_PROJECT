// ─── Portfolio data ────────────────────────────────────────────────
// Facts only. Copy that changes with the language lives in src/i18n.

import type { TechId } from "./tech";

/** The site's public address; keep it equal to `site` in astro.config.mjs. joelcodja.com replaces it once connected. */
export const SITE_URL = "https://joelcodja.pages.dev";

/**
 * Whether /projects is shown (header link, "All projects" button, indexed). Back since 2026-11-01 with
 * every project of the deck; false hides it again without deleting it.
 */
export const PROJECTS_PAGE = true;

/**
 * Whether /pics is shown. Hidden by Joel (2026-11-01) while it is being filled: no header link, and it
 * asks search engines not to list it. Its files stay; set to true to bring it back.
 */
export const PICS_PAGE = false;

/**
 * /kojima and /music: off the home page since 2026-10-31 and linked from nowhere. They stay online but
 * ask search engines not to list them, and stay out of the sitemap (Joel, 2026-11-02).
 */
export const KOJIMA_PAGE = false;
export const MUSIC_PAGE = false;

export const PERSONAL = {
  name: "Joel Codja",
  surname: "Codja",
  pronunciation: "/ko.dʒa/",
  email: "gide749@gmail.com",
  github: "https://github.com/cjdotdev",
  linkedin: "https://www.linkedin.com/in/joel-codja-4356a2361/",
  twitter: "https://x.com/Gide749Gide",
  hashnode: "https://blog-cjdevcom.hashnode.dev",
  // TODO(Joel): the CV is not in the repo yet. Put the PDF at public/cv/joel-codja-cv.pdf; until then
  // the hero's "Download my CV" button leads to a 404.
  cv: "/cv/joel-codja-cv.pdf",
};


export interface Project {
  id: "makisend" | "linkedin-scheduler" | "contrasto" | "zeroknowledge" | "pulse";
  stack: TechId[];
  /** Month the project shipped, "YYYY-MM"; while it has a status, the month it is planned for. */
  delivered: string;
  /** Not shipped yet: "building" (work under way) or "planned" (next up). Such a project shows a
      construction face on its card and is left out of /projects until it ships. */
  status?: "building" | "planned";
  repo?: string;
  site?: string;
  /** The project's own symbol, square (public/projects). */
  logo: string;
  /** Muted loop on the home page's project cards (public/video, WebM). Without one the card shows the screenshot. */
  video?: { src: string; poster: string };
}

// TODO(Joel): the delivered dates are placeholders from git history, replace them with the real ones.
export const PROJECTS: Project[] = [
  {
    id: "makisend",
    logo: "/projects/makisend.svg",
    stack: [
      "workers",
      "d1",
      "queues",
      "workflows",
      "typescript",
      "hono",
      "drizzle",
      "better-auth",
      "zod",
      "astro",
      "react",
      "tailwind",
      "vitest",
    ],
    delivered: "2026-10",
    repo: "https://github.com/lixalistudio-oss/makisend",
    site: "https://makisend.lixalistudio.tech",
    video: { src: "/video/makisend.webm", poster: "/video/makisend-poster.webp" },
  },
  {
    id: "linkedin-scheduler",
    logo: "/projects/linkedin-scheduler.svg",
    stack: ["python", "linkedin", "cron", "node", "playwright", "shiki", "markdown"],
    delivered: "2026-10",
    repo: "https://github.com/cjdotdev/linkedin-scheduler",
    site: "https://linkedin-scheduler.makisend-poc.workers.dev",
    video: { src: "/video/linkedin-scheduler.webm", poster: "/video/linkedin-scheduler-poster.webp" },
  },
  {
    id: "zeroknowledge",
    logo: "/projects/zeroknowledge.svg",
    // Supasecret (Backend/supasecret: DESIGN.md, brand/; spec in Backend/zeroknowledge-poc). The id stays.
    stack: ["workers", "hono", "typescript", "webcrypto", "durable-objects", "vitest"],
    status: "building",
    // Planned for the end of November 2026 (Joel).
    delivered: "2026-11",
    // The concept trailer (Backend/supasecret-trailer, Remotion): there is no app to film yet.
    // -v2: the first cut (rendered for a full screen) was replaced; a new name so no cache serves the old one.
    video: { src: "/video/supasecret-v2.webm", poster: "/video/supasecret-poster-v2.webp" },
  },
  {
    // Voctra (Backend/voctra: DESIGN.md, brand/), a Thunder Client-style VS Code extension. The id stays.
    id: "pulse",
    logo: "/projects/pulse.svg",
    stack: ["typescript", "vscode-api", "node", "esbuild", "vitest"],
    status: "building",
    // Planned for December 2026 (Joel).
    delivered: "2026-12",
    // The concept trailer (Backend/voctra-trailer, Remotion): the extension is not built yet.
    video: { src: "/video/voctra.webm", poster: "/video/voctra-poster.webp" },
  },
];

export interface Experience {
  id: "lixali";
  company: string;
  site: string;
  /** ISO month, formatted per locale. */
  start: string;
  end?: string;
}

export const EXPERIENCE: Experience[] = [
  { id: "lixali", company: "Lixali Studio", site: "https://lixalistudio.tech", start: "2026-04" },
];

/**
 * The tools Joel works with, in four rows under "What I can do for you". Only what a shipped project
 * or his own code proves (MakiSend, linkedin-scheduler, this site): a recruiter will ask where.
 * PostgreSQL is confirmed by Joel; Redis and Express he has not used (2026-11-01).
 */
export const STACK: { id: "languages" | "apis" | "cloud" | "quality"; tools: TechId[] }[] = [
  { id: "languages", tools: ["typescript", "sql", "python"] },
  { id: "apis", tools: ["hono", "node", "rest", "openapi", "scalar", "zod"] },
  { id: "cloud", tools: ["workers", "d1", "queues", "workflows", "drizzle", "sqlite", "postgresql"] },
  { id: "quality", tools: ["vitest", "github-actions", "docker"] },
];
