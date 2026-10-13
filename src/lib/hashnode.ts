import { PERSONAL } from "../data";

export interface BlogPost {
  title: string;
  url: string;
  brief: string;
  cover?: string;
  date: string; // ISO string, may be "" if unparseable
}

const FEED_URL = `${PERSONAL.hashnode}/rss.xml`;
const MAX_BRIEF = 180;

let cache: Promise<BlogPost[]> | null = null;

function decode(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(value: string): string {
  // Unwrap CDATA first: "]]>" would otherwise be read as the end of a tag.
  const unwrapped = value.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "");
  return decode(unwrapped.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(text: string, max = MAX_BRIEF): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > max * 0.6 ? space : max).trim()}…`;
}

function field(item: string, tag: string): string {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return match ? match[1].trim() : "";
}

function parseFeed(xml: string): BlogPost[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  const posts: BlogPost[] = [];

  for (const item of items) {
    const title = stripTags(field(item, "title"));
    const url = stripTags(field(item, "link"));
    if (!title || !url) continue;

    const pubDate = field(item, "pubDate");
    const parsedDate = pubDate ? new Date(pubDate) : null;
    const enclosure = item.match(/<enclosure[^>]*url="([^"]+)"/);

    posts.push({
      title,
      url,
      brief: excerpt(stripTags(field(item, "description"))),
      cover: enclosure?.[1],
      date: parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : "",
    });
  }

  return posts;
}

/** Fetches and parses the Hashnode RSS feed once per build; degrades to []. */
export function getBlogPosts(): Promise<BlogPost[]> {
  if (!cache) {
    cache = fetch(FEED_URL)
      .then((res) => (res.ok ? res.text() : ""))
      .then((xml) => (xml ? parseFeed(xml) : []))
      .catch(() => []);
  }
  return cache;
}
