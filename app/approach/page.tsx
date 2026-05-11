import { ApproachPageContent } from "@/components/page-routes"
import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata({
  locale: "tr",
  title: "Yaklaşımımız",
  description: "Önce strateji, sonra zanaat. Adakan Software tasarım kararlarını marka, kullanıcı ve sürdürülebilirlik odağında kurar.",
  path: "/approach",
})

export default function ApproachPage() {
  return <ApproachPageContent locale="tr" />
}
