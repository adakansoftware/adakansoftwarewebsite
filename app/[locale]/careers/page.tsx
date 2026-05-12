import { CareersPageContent } from "@/components/static-page-routes"
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
    title: locale === "tr" ? "Kariyer" : "Careers",
    description:
      locale === "tr"
        ? "Adakan Software ile tasar?m, marka ve dijital ?r?n geli?tirme oda??nda ?al??ma f?rsatlar?n? ke?fedin."
        : "Explore opportunities to work with Adakan Software on design, brand, and digital product delivery.",
    path: "/careers",
  })
}

export default async function CareersRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <CareersPageContent locale={locale} />
}
