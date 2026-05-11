import { ContactPageContent } from "@/components/page-routes"
import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata({
  locale: "tr",
  title: "İletişim",
  description: "Yeni web sitesi, marka kimliği veya dijital ürün projeniz için Adakan Software ile iletişime geçin.",
  path: "/contact",
})

export default function ContactPage() {
  return <ContactPageContent locale="tr" />
}
