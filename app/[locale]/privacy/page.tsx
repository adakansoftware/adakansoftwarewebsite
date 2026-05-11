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
        ? "Adakan Software web sitesinde paylaşılan iletişim bilgilerinin nasıl işlendiğine dair özet gizlilik bilgileri."
        : "Summary privacy information about how contact details shared through the Adakan Software website are handled.",
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
