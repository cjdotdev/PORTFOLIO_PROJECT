import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { rename, rmdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Astro writes only the root 404 as 404.html; the French one comes out as fr/404/index.html. Cloudflare
// Pages serves the nearest 404.html up the path, so move it to fr/404.html after the build.
const frenchNotFound = {
  name: "french-404",
  hooks: {
    "astro:build:done": async ({ dir }) => {
      const out = fileURLToPath(dir);
      await rename(`${out}fr/404/index.html`, `${out}fr/404.html`);
      await rmdir(`${out}fr/404`);
    },
  },
};

export default defineConfig({
  // joelcodja.com is bought (2026-11-02) but not connected yet: switch here and in SITE_URL once it is.
  site: "https://joelcodja.pages.dev",
  integrations: [react(), frenchNotFound],
  // Blog posts (src/content/blog): code is highlighted at build time. Vesper is dark with warm orange
  // accents, close to the site's terracotta.
  markdown: {
    shikiConfig: { theme: "vesper", wrap: false },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    // Pre-bundled at startup: a dependency discovered mid-session makes Vite re-optimize and answer
    // 504 to islands that were already loading (the contact form never hydrated).
    optimizeDeps: {
      include: ["react", "react-dom", "react-dom/client", "@emailjs/browser"],
    },
  },
});
