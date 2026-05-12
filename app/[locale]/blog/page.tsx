import { BlogPageContent } from "@/components/static-page-routes"
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
    title: "Blog",
    description:
      locale === "tr"
        ? "Tasar?m, marka ve frontend geli?tirme ?zerine k?sa ama stratejik dijital b?y?me notlar?."
        : "Short strategic notes on digital growth, design, brand, and frontend delivery.",
    path: "/blog",
  })
}

export default async function BlogRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <BlogPageContent locale={locale} />
}
