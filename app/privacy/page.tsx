import { LegalPageContent } from "@/components/static-page-routes"
import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata({
  locale: "tr",
  title: "Gizlilik",
  description: "Adakan Software web sitesinde paylaşılan iletişim bilgilerinin nasıl işlendiğine dair özet gizlilik bilgileri.",
  path: "/privacy",
})

export default function PrivacyPage() {
  return <LegalPageContent locale="tr" type="privacy" />
}
