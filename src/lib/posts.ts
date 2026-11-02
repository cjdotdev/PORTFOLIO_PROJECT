import { getCollection, type CollectionEntry } from "astro:content";
import { localePath, type Locale } from "../i18n";

export type Post = CollectionEntry<"blog">;

/** A post as one language shows it: its own version, or the other language's when it has none. */
export interface LocalPost {
  /** The URL name, shared by both versions: /blog/<slug>/ and /fr/blog/<slug>/. */
  slug: string;
  /** The language this version is written in (not always the page's). */
  lang: Locale;
  entry: Post;
  /** The languages the post exists in. */
  langs: Locale[];
}

/** Drafts show under `astro dev`, or in a build run with SHOW_DRAFTS=true (to check them locally). */
const SHOW_DRAFTS = import.meta.env.DEV || process.env.SHOW_DRAFTS === "true";

/** Every post for one language, newest first. A post missing in that language shows in the other one. */
export async function getPosts(locale: Locale): Promise<LocalPost[]> {
  const entries = await getCollection("blog", (post) => SHOW_DRAFTS || !post.data.draft);
  const bySlug = new Map<string, Partial<Record<Locale, Post>>>();
  for (const entry of entries) {
    const [lang, slug] = [entry.id.slice(0, 2) as Locale, entry.id.slice(3)];
    bySlug.set(slug, { ...bySlug.get(slug), [lang]: entry });
  }
  const other: Locale = locale === "fr" ? "en" : "fr";
  return [...bySlug]
    .map(([slug, versions]) => {
      const lang = versions[locale] ? locale : other;
      return { slug, lang, entry: versions[lang]!, langs: Object.keys(versions) as Locale[] };
    })
    .sort((a, b) => b.entry.data.date.getTime() - a.entry.data.date.getTime());
}

/** The page of a post in a language: /blog/<slug>/ or /fr/blog/<slug>/. */
export function postPath(locale: Locale, slug: string): string {
  return localePath(locale, `/blog/${slug}/`);
}

/** Minutes to read the post, at about 230 words a minute (code counts like prose). */
export function readingTime(post: Post): number {
  const words = (post.body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
