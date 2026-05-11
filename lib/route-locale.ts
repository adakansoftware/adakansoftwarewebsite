import { notFound } from "next/navigation"

import { defaultLocale, isLocale, locales, type Locale } from "@/lib/i18n"

type LocaleParamsInput = Promise<{ locale: string }> | { locale: string }

export const prefixedLocales = locales.filter((locale) => locale !== defaultLocale)

export async function getRouteLocale(params: LocaleParamsInput): Promise<Locale> {
  const resolvedParams = await params

  if (!isLocale(resolvedParams.locale)) {
    notFound()
  }

  return resolvedParams.locale
}

export async function getPrefixedRouteLocale(params: LocaleParamsInput): Promise<Locale> {
  const locale = await getRouteLocale(params)

  if (locale === defaultLocale) {
    notFound()
  }

  return locale
}

export function getLocaleStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export function getPrefixedLocaleStaticParams() {
  return prefixedLocales.map((locale) => ({ locale }))
}
