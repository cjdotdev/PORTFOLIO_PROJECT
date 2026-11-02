import type { APIRoute } from "astro";
import { PERSONAL, SITE_URL } from "../data";
import { getPosts } from "../lib/posts";

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The posts as an RSS feed, for readers who follow blogs in a feed reader. */
export const GET: APIRoute = async () => {
  const posts = await getPosts();
  const items = posts
    .map(({ id, data }) => {
      const url = `${SITE_URL}/blog/${id}/`;
      return `    <item>
      <title>${escape(data.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <description>${escape(data.subtitle)}</description>
      <pubDate>${data.date.toUTCString()}</pubDate>
${data.tags.map((tag) => `      <category>${escape(tag)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(PERSONAL.name)}</title>
    <link>${SITE_URL}/blog/</link>
    <description>Notes from building things.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
