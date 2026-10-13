import { useEffect, useState } from "react";

const SUN_PATH =
  "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z";

const MOON_PATH =
  "M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z";

function getTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export default function ThemeToggle({ label }: { label: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(getTheme() === "dark");
  }, []);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    setDark(next === "dark");
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={dark}
      onClick={toggle}
      className="flex items-center justify-center px-2.5 py-[7px] rounded-full cursor-pointer transition-colors text-ink/70 hover:text-ink"
      style={{
        background: "rgb(var(--color-surface) / 0.9)",
        border: "1px solid rgb(var(--color-line) / 0.15)",
      }}
    >
      <svg
        className="w-[18px] h-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={dark ? MOON_PATH : SUN_PATH} />
      </svg>
    </button>
  );
}
