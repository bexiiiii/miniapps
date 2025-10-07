export const i18n = {
  defaultLocale: "kk",
  locales: ["kk", "ru"],
} as const;

export type Locale = (typeof i18n)["locales"][number];
