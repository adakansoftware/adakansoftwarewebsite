import { LegalPageContent } from "@/components/static-page-routes"
import { createPageMetadata } from "@/lib/metadata"
import { getPrefixedLocaleStaticParams, getPrefixedRouteLocale } from "@/lib/route-locale"

export function generateStaticParams() {
  return getPrefixedLocaleStaticParams()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)

  return createPageMetadata({
    locale,
    title: locale === "tr" ? "Gizlilik" : "Privacy",
    description:
      locale === "tr"
        ? "Adakan Software gizlilik yaklaşımı, veri kullanımı ve iletişim süreçleri hakkında bilgiler."
        : "Information about Adakan Software privacy practices, data use, and communication processes.",
    path: "/privacy",
  })
}

export default async function PrivacyRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <LegalPageContent locale={locale} type="privacy" />
}
