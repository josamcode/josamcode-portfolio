export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeMeta: Record<
  Locale,
  { label: string; native: string; dir: "ltr" | "rtl"; htmlLang: string; ogLocale: string }
> = {
  en: { label: "EN", native: "English", dir: "ltr", htmlLang: "en", ogLocale: "en_US" },
  ar: { label: "AR", native: "العربية", dir: "rtl", htmlLang: "ar", ogLocale: "ar_EG" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return localeMeta[locale].dir;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "ar" : "en";
}

/** Build a locale-prefixed path: href("ar", "/work") -> "/ar/work" */
export function href(locale: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Strip the locale prefix from a pathname: "/ar/work/raeetna" -> "/work/raeetna" */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length && isLocale(segments[0])) segments.shift();
  return segments.length ? `/${segments.join("/")}` : "/";
}

/** Alternate-language URL map for <link rel="alternate" hreflang>. */
export function languageAlternates(path: string, base: string) {
  return {
    en: `${base}${href("en", path)}`,
    ar: `${base}${href("ar", path)}`,
    "x-default": `${base}${href(defaultLocale, path)}`,
  };
}
