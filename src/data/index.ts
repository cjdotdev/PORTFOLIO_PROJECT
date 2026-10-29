// ─── Portfolio data ────────────────────────────────────────────────
// Facts only. Copy that changes with the language lives in src/i18n.

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
  stack: string[];
  repo?: string;
  site?: string;
  /** Shown on the home page as a case study; the rest only on /projects. */
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: "makisend",
    stack: ["Cloudflare Workers", "Workflows", "D1", "Queues", "TypeScript"],
    repo: "https://github.com/lixalistudio-oss/makisend",
    site: "https://makisend.lixalistudio.tech",
    featured: true,
  },
  {
    id: "linkedin-scheduler",
    stack: ["Python", "LinkedIn API", "cron", "Node.js", "HTML"],
    repo: "https://github.com/cjdotdev/linkedin-scheduler",
    site: "https://linkedin-scheduler.makisend-poc.workers.dev",
    featured: true,
  },
  {
    id: "contrasto",
    stack: ["Next.js", "TypeScript"],
    repo: "https://github.com/alpha1207vj/CHECKERCONTRASTOWCAG",
    site: "https://codja.vercel.app",
    featured: false,
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
