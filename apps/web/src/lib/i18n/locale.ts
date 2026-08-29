export const locales = ["ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export const localeStorageKey = "plp-locale";

export function parseLocale(value: string | null | undefined): Locale {
  if (value === "en") {
    return "en";
  }

  return defaultLocale;
}
