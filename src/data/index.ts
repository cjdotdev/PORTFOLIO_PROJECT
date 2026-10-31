// ─── Portfolio data ────────────────────────────────────────────────
// Facts only. Copy that changes with the language lives in src/i18n.

import type { TechId } from "./tech";

/** The site's public address. Change it here once the final domain is bought. */
export const SITE_URL = "https://joelcodja.pages.dev";

/**
 * Whether /projects is shown. Hidden while it only repeats the home deck (Joel, 2026-10-31): nothing
 * links to it, it asks search engines not to list it, and "Projects" leads to the deck on the home
 * page instead. Set back to true once the page has something of its own (case studies).
 */
export const PROJECTS_PAGE = false;

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

/**
 * Fallback for the "where I am" block, rendered into the HTML so the page never shows an empty box.
 * The live answer comes from GET /api/where (functions/api/where.ts), which reads the same fields
 * from the Pages project's environment and adds the weather. City level only: the coordinates are
 * the city centre, never anything finer.
 */
export const LOCATION = {
  city: "Cotonou",
  country: "Benin",
  from: "Gabon",
  timezone: "Africa/Porto-Novo",
  lat: 6.3654,
  lon: 2.4183,
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
    id: "contrasto",
    logo: "/projects/contrasto.svg",
    stack: ["nextjs", "react", "typescript", "tailwind", "next-intl"],
    delivered: "2026-04",
    repo: "https://github.com/cjdotdev/CHECKERCONTRASTOWCAG",
    site: "https://codja.vercel.app",
  },
  {
    id: "zeroknowledge",
    logo: "/projects/zeroknowledge.svg",
    stack: ["workers", "hono", "typescript", "webcrypto", "d1", "durable-objects", "r2", "vitest"],
    status: "building",
    // TODO(Joel): planned month is a placeholder.
    delivered: "2027-01",
  },
  {
    // TODO(Joel): a made-up project to fill the deck; replace it with a real one.
    id: "pulse",
    logo: "/projects/pulse.svg",
    stack: ["workers", "hono", "typescript", "d1", "cron", "astro"],
    status: "planned",
    delivered: "2027-04",
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
