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
    title: locale === "tr" ? "Hakkımızda" : "About",
    description:
      locale === "tr"
        ? "Adakan Software tasarım, marka ve yazılımı aynı büyüme hedefinde birleştiren premium dijital stüdyodur."
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
