/**
 * Light, dark or the device's own setting (the default), as on makisend.lixalistudio.tech. The choice
 * is saved per browser; every component themes through `data-theme` on <html>, set before the first
 * paint by the inline script in Layout.astro (same key, same rules: keep them in sync).
 */
export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "joelcodja.theme";
export const DEFAULT_THEME: Theme = "system";
const THEME_CHANGE_EVENT = "joelcodja:theme-change";
const DARK_QUERY = "(prefers-color-scheme: dark)";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

export function readTheme(): Theme {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(saved) ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme !== "system") return theme;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/** Applies a theme, remembers it and tells the other islands about it. */
export function setTheme(theme: Theme): void {
  const resolved = resolveTheme(theme);
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
  try {
    if (theme === DEFAULT_THEME) window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // storage disabled: the choice lasts for this page only
  }
  window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }));
}

export function onThemeChange(listener: (theme: Theme) => void): () => void {
  const handler = (event: Event) => listener((event as CustomEvent<Theme>).detail);
  window.addEventListener(THEME_CHANGE_EVENT, handler);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, handler);
}
