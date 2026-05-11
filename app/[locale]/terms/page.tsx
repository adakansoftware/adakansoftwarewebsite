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
    title: locale === "tr" ? "Kullanım Şartları" : "Terms",
    description:
      locale === "tr"
        ? "Adakan Software web sitesinin kullanımına dair genel şartlar ve içerik kullanım çerçevesi."
        : "General website usage terms and content usage rules for the Adakan Software website.",
    path: "/terms",
  })
}

export default async function TermsRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <LegalPageContent locale={locale} type="terms" />
}
