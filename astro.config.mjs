import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  // Change with SITE_URL in src/data/index.ts once the final domain is bought.
  site: "https://joelcodja.pages.dev",
  integrations: [react()],
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
