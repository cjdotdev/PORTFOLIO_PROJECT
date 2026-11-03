import type { APIRoute } from "astro";
import { KOJIMA_PAGE, MUSIC_PAGE, PICS_PAGE, PROJECTS_PAGE, SITE_URL } from "../data";
import { getPosts, postPath } from "../lib/posts";
import { casePath, getCaseStudies } from "../lib/work";

/**
 * The pages search engines should list, each with its French twin (hreflang). Hidden pages stay out,
 * like drafts. A post is listed in each language it is written in, each version naming the other.
 */
export const GET: APIRoute = async () => {
  const pages = [
    "/",
    PROJECTS_PAGE && "/projects/",
    "/blog/",
    PICS_PAGE && "/pics/",
    KOJIMA_PAGE && "/kojima/",
    MUSIC_PAGE && "/music/",
    ...(PROJECTS_PAGE ? (await getCaseStudies("en")).map((study) => casePath("en", study.project.id)) : []),
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
    ...(await getPosts("en")).flatMap(({ slug, langs, entry: { data } }) => {
      const lastmod = (data.updated ?? data.date).toISOString().slice(0, 10);
      const twins =
        langs.length > 1
          ? langs.map((lang) => `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE_URL}${postPath(lang, slug)}"/>`).join("")
          : "";
      return langs.map(
        (lang) => `  <url>\n    <loc>${SITE_URL}${postPath(lang, slug)}</loc>${twins}\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
      );
    }),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
