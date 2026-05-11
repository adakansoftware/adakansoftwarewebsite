import { TestimonialsPageContent } from "@/components/page-routes"
import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata({
  locale: "tr",
  title: "Yorumlar",
  description: "Adakan Software ile çalışan ekiplerin deneyimleri, süreç kalitesi ve sonuç odaklı iş birlikleri.",
  path: "/testimonials",
})

export default function TestimonialsPage() {
  return <TestimonialsPageContent locale="tr" />
}
