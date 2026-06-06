import { NotFoundView } from "@/components/not-found-view"
import { getRequestLocale } from "@/lib/request-locale"

export default async function NotFound() {
  const locale = await getRequestLocale()
  return <NotFoundView locale={locale} />
}
