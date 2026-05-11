import { CareersPageContent } from "@/components/static-page-routes"
import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata({
  locale: "tr",
  title: "Kariyer",
  description: "Adakan Software ekibi için güçlü tasarım, frontend ve marka stratejisi portfolyolarını paylaşıp tanışabilirsiniz.",
  path: "/careers",
})

export default function CareersPage() {
  return <CareersPageContent locale="tr" />
}
