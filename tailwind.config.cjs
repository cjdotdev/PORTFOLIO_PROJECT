/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        muted: "rgb(var(--color-ink) / 0.65)",
      },
      maxWidth: {
        page: "768px",
      },
      fontFamily: {
        serif: ["var(--font-dm-serif)"],
        mono: ["var(--font-dm-mono)"],
        sans: ["var(--font-geist)"],
      },
    },
  },
  plugins: [],
};
