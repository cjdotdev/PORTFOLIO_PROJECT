// Screenshots every [data-shot] element of an HTML file at 2x, as <id>.png in the output directory.
// Used for the social images made in the site's style (GitHub profile, LinkedIn banner).
// Usage: node scripts/render-shots.mjs <path to playwright-core> <html file> <output dir> [page width]
import { createRequire } from "node:module";
import path from "node:path";

const [lib, file, out, width = "830"] = process.argv.slice(2);
const { chromium } = createRequire(import.meta.url)(lib);

const browser = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--allow-file-access-from-files"] });
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 }, deviceScaleFactor: 2 });
await page.goto("file://" + path.resolve(file), { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
for (const shot of await page.locator("[data-shot]").all()) {
  const id = await shot.getAttribute("id");
  await shot.screenshot({ path: path.join(out, `${id}.png`), omitBackground: true });
}
await browser.close();
