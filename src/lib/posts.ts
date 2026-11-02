import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

/** Drafts show under `astro dev`, or in a build run with SHOW_DRAFTS=true (to check them locally). */
const SHOW_DRAFTS = import.meta.env.DEV || process.env.SHOW_DRAFTS === "true";

/** Newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", (post) => SHOW_DRAFTS || !post.data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Minutes to read the post, at about 230 words a minute (code counts like prose). */
export function readingTime(post: Post): number {
  const words = (post.body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
