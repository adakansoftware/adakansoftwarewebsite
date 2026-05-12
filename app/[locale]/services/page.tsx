import { ServicesPageContent } from "@/components/page-routes"
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
    title: locale === "tr" ? "Hizmetler" : "Services",
    description:
      locale === "tr"
        ? "Web tasar?m, marka kimli?i, UI/UX ve frontend geli?tirme alanlar?nda premium, ?l??lebilir dijital hizmetler."
        : "Premium digital services across web design, brand identity, UI/UX, and frontend development.",
    path: "/services",
  })
}

export default async function ServicesRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <ServicesPageContent locale={locale} />
}
