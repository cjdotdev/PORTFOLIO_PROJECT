// ─── Portfolio data ────────────────────────────────────────────────
// Facts only. Copy that changes with the language lives in src/i18n.

import type { TechId } from "./tech";

/** The site's public address. Change it here once the final domain is bought. */
export const SITE_URL = "https://joelcodja.pages.dev";

export const PERSONAL = {
  name: "Joel Codja",
  surname: "Codja",
  pronunciation: "/ko.dʒa/",
  email: "gide749@gmail.com",
  github: "https://github.com/cjdotdev",
  linkedin: "https://www.linkedin.com/in/joel-codja-4356a2361/",
  twitter: "https://x.com/Gide749Gide",
  hashnode: "https://blog-cjdevcom.hashnode.dev",
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
  id: "makisend" | "linkedin-scheduler" | "contrasto";
  stack: TechId[];
  /** Month the project shipped, "YYYY-MM". */
  delivered: string;
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
