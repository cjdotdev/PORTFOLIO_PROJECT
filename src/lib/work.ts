import { getCollection, type CollectionEntry } from "astro:content";
import { PROJECTS, type Project } from "../data";
import { localePath, type Locale } from "../i18n";

export type CaseEntry = CollectionEntry<"work">;

/** A case study as one language shows it: its own version, or the other language's when it has none. */
export interface CaseStudy {
  project: Project;
  /** The language this version is written in (not always the page's). */
  lang: Locale;
  entry: CaseEntry;
  langs: Locale[];
}

const SHOW_DRAFTS = import.meta.env.DEV || process.env.SHOW_DRAFTS === "true";

/** Every case study for one language, in the order of PROJECTS. Only shipped projects get one. */
export async function getCaseStudies(locale: Locale): Promise<CaseStudy[]> {
  const entries = await getCollection("work", (entry) => SHOW_DRAFTS || !entry.data.draft);
  const byId = new Map<string, Partial<Record<Locale, CaseEntry>>>();
  for (const entry of entries) {
    const [lang, id] = [entry.id.slice(0, 2) as Locale, entry.id.slice(3)];
    if (!PROJECTS.some((project) => project.id === id)) {
      throw new Error(`src/content/work: "${id}" is not a project id in PROJECTS (src/data/index.ts).`);
    }
    byId.set(id, { ...byId.get(id), [lang]: entry });
  }
  const other: Locale = locale === "fr" ? "en" : "fr";
  return PROJECTS.filter((project) => !project.status && byId.has(project.id)).map((project) => {
    const versions = byId.get(project.id)!;
    const lang = versions[locale] ? locale : other;
    return { project, lang, entry: versions[lang]!, langs: Object.keys(versions) as Locale[] };
  });
}

/** The case study's page in a language: /projects/<id>/ or /fr/projects/<id>/. */
export function casePath(locale: Locale, id: Project["id"]): string {
  return localePath(locale, `/projects/${id}/`);
}
