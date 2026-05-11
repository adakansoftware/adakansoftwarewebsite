import { AboutPageContent } from "@/components/page-routes"
import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata({
  locale: "tr",
  title: "Hakkımızda",
  description: "Adakan Software tasarım, marka ve yazılımı aynı büyüme hedefinde birleştiren premium dijital stüdyodur.",
  path: "/about",
})

export default function AboutPage() {
  return <AboutPageContent locale="tr" />
}
