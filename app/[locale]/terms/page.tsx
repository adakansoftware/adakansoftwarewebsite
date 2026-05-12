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
        ? "Adakan Software web sitesi kullanım şartları, hizmet kapsamı ve sorumluluk sınırları."
        : "Adakan Software website terms, service scope, and limitations of responsibility.",
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
