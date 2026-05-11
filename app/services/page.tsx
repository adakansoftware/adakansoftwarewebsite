import { ServicesPageContent } from "@/components/page-routes"
import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata({
  locale: "tr",
  title: "Hizmetler",
  description: "Premium web tasarımı, marka kimliği, UI/UX ve frontend geliştirme hizmetleri.",
  path: "/services",
})

export default function ServicesPage() {
  return <ServicesPageContent locale="tr" />
}
