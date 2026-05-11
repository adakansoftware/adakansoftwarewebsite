import { LegalPageContent } from "@/components/static-page-routes"
import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata({
  locale: "tr",
  title: "Kullanım Şartları",
  description: "Adakan Software web sitesinin genel kullanım şartlarına dair özet bilgiler.",
  path: "/terms",
})

export default function TermsPage() {
  return <LegalPageContent locale="tr" type="terms" />
}
