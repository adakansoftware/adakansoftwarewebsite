import { ContactPageContent } from "@/components/page-routes"
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
    title: locale === "tr" ? "İletişim" : "Contact",
    description:
      locale === "tr"
        ? "Yeni web sitesi, marka kimliği veya dijital ürün projeniz için Adakan Software ile iletişime geçin."
        : "Get in touch with Adakan Software about your new website, brand identity, or digital product project.",
    path: "/contact",
  })
}

export default async function ContactRoute({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <ContactPageContent locale={locale} />
}
