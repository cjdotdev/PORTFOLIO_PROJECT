import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Blog posts: one Markdown file per post in src/content/blog, either `my-post.md` or, when the post has
 * images, a folder `my-post/index.md` with its images next to it. The file or folder name is the URL
 * (/blog/my-post/). Posts are written in English, whatever the page's language.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        /** One or two sentences: under the title, in the lists, and as the page's description. */
        subtitle: z.string(),
        date: z.coerce.date(),
        /** Set when a published post changes in substance. */
        updated: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
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
