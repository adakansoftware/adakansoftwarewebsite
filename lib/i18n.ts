export type Locale = "tr" | "en"

export const locales: Locale[] = ["tr", "en"]

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "tr"
}

export function withLocale(path: string, locale: Locale) {
  if (locale === "tr") return path
  return path === "/" ? "/en" : `/en${path}`
}

export function switchLocalePath(pathname: string, targetLocale: Locale) {
  const withoutLocale =
    pathname === "/en" ? "/" : pathname.startsWith("/en/") ? pathname.slice(3) || "/" : pathname

  if (targetLocale === "tr") return withoutLocale
  return withoutLocale === "/" ? "/en" : `/en${withoutLocale}`
}
