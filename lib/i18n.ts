export type Locale = "tr" | "en"

export const locales = ["tr", "en"] as const satisfies readonly Locale[]
export const defaultLocale: Locale = "tr"
export const localeHeaderName = "x-adakan-locale"

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : defaultLocale
}

export function stripLocalePrefix(pathname: string) {
  if (pathname === "/en") return "/"
  if (pathname.startsWith("/en/")) return pathname.slice(3) || "/"
  if (pathname === "/tr") return "/"
  if (pathname.startsWith("/tr/")) return pathname.slice(3) || "/"
  return pathname
}

export function withLocale(path: string, locale: Locale) {
  const normalizedPath = path === "" ? "/" : path
  const cleanPath = stripLocalePrefix(normalizedPath)
  if (locale === defaultLocale) return cleanPath
  return cleanPath === "/" ? "/en" : `/en${cleanPath}`
}

export function switchLocalePath(pathname: string, targetLocale: Locale) {
  const withoutLocale = stripLocalePrefix(pathname)
  return withLocale(withoutLocale, targetLocale)
}
