import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Blog posts: one Markdown file per post and language in src/content/blog. English is `my-post.md` (or
 * `my-post/index.md` in a folder with its images), French sits beside it as `my-post.fr.md` (or
 * `my-post/index.fr.md`, sharing the folder's images). The name is the URL: /blog/my-post/ and
 * /fr/blog/my-post/. Entries are keyed "en/my-post" and "fr/my-post" (src/lib/posts.ts pairs them).
 */
/** The blog's sections, English then French: the topic filters on /blog. A new one is Joel's call. */
const SECTIONS = ["Security", "TypeScript", "Backend", "Tools", "Sécurité", "Outils"] as const;

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/blog",
    generateId: ({ entry }) => {
      const [, slug, fr] = /^(.*?)(?:\/index)?(\.fr)?\.md$/.exec(entry.replaceAll("\\", "/")) ?? [];
      return `${fr ? "fr" : "en"}/${slug}`;
    },
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        /** One or two sentences: under the title, in the lists, and as the page's description. */
        subtitle: z.string(),
        date: z.coerce.date(),
        /** Set when a published post changes in substance. */
        updated: z.coerce.date().optional(),
        /** One or two of the blog's sections, in the post's language (Joel keeps them to four). */
        tags: z.array(z.enum(SECTIONS)).max(2).default([]),
        /** A path relative to the post, e.g. ./cover.webp. About 1600x840 is best (1.9:1). */
        cover: image().optional(),
        coverAlt: z.string().optional(),
        /** Shown under `astro dev` only; left out of the built site. */
        draft: z.boolean().default(false),
      })
      .refine((post) => !post.cover || post.coverAlt, {
        message: "A post with a cover needs coverAlt (what the image shows).",
        path: ["coverAlt"],
      }),
});

export const collections = { blog };
