export const i18n = {
  locales: ["en", "de", "fr"] as const,
  defaultLocale: "en" as const,
} as const;

export type Locale = (typeof i18n)["locales"][number];