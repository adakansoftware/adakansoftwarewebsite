import { AboutPageContent } from "@/components/page-routes"
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
    title: locale === "tr" ? "Hakk?m?zda" : "About",
    description:
      locale === "tr"
        ? "Adakan Software tasar?m, marka ve yaz?l?m? ayn? b?y?me hedefinde birle?tiren premium dijital st?dyodur."
        : "Adakan Software is a premium digital studio connecting design, brand, and software around business growth.",
    path: "/about",
  })
}

export default async function AboutRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <AboutPageContent locale={locale} />
}
