import type { APIRoute } from "astro";
import { KOJIMA_PAGE, MUSIC_PAGE, PICS_PAGE, PROJECTS_PAGE, SITE_URL } from "../data";
import { getPosts } from "../lib/posts";

/**
 * The pages search engines should list, each with its French twin (hreflang). Hidden pages stay out,
 * like drafts. A post is listed once, in English: its French page points to it as canonical.
 */
export const GET: APIRoute = async () => {
  const pages = [
    "/",
    PROJECTS_PAGE && "/projects/",
    "/blog/",
    PICS_PAGE && "/pics/",
    KOJIMA_PAGE && "/kojima/",
    MUSIC_PAGE && "/music/",
  ].filter((path): path is string => Boolean(path));
  const twin = (path: string) => `
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${path}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_URL}/fr${path}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${path}"/>`;
  const urls = [
    ...pages.flatMap((path) => [
      `  <url>\n    <loc>${SITE_URL}${path}</loc>${twin(path)}\n  </url>`,
      `  <url>\n    <loc>${SITE_URL}/fr${path}</loc>${twin(path)}\n  </url>`,
    ]),
    ...(await getPosts()).map(
      ({ id, data }) =>
        `  <url>\n    <loc>${SITE_URL}/blog/${id}/</loc>\n    <lastmod>${(data.updated ?? data.date).toISOString().slice(0, 10)}</lastmod>\n  </url>`,
    ),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
