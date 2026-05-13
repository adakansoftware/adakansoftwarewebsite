import { LegalPageContent } from "@/components/static-page-routes"
import { createRouteMetadata } from "@/lib/metadata"
import { getLocaleStaticParams, getRouteLocale } from "@/lib/route-locale"

export function generateStaticParams() {
  return getLocaleStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getRouteLocale(params)
  return createRouteMetadata("privacy", locale, "/privacy")
}

export default async function PrivacyRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getRouteLocale(params)
  return <LegalPageContent locale={locale} type="privacy" />
}
