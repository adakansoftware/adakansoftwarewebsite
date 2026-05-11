import { headers } from "next/headers"

import { defaultLocale, isLocale, localeHeaderName, type Locale } from "@/lib/i18n"

export async function getRequestLocale(): Promise<Locale> {
  const requestHeaders = await headers()
  const requestLocale = requestHeaders.get(localeHeaderName)

  return requestLocale && isLocale(requestLocale) ? requestLocale : defaultLocale
}
