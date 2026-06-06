import { NotFoundView } from "@/components/not-found-view"
import { getPrefixedRouteLocale } from "@/lib/route-locale"

export default async function LocaleNotFound({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const locale = await getPrefixedRouteLocale(params)
  return <NotFoundView locale={locale} />
}
