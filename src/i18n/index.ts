import { en, type Dict } from "./en";
import { fr } from "./fr";

export type { Dict };

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];

const dictionaries: Record<Locale, Dict> = { en, fr };

export function getDict(locale: string): Dict {
  return dictionaries[locale as Locale] ?? en;
}

export function localePath(locale: Locale, path: string): string {
  return locale === "fr" ? `/fr${path}` : path;
}
