import { BlogPageContent } from "@/components/static-page-routes"
import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata({
  locale: "tr",
  title: "Blog",
  description: "Tasarım, marka ve frontend geliştirme tarafında iş hedeflerine bağlanan pratik notlar.",
  path: "/blog",
})

export default function BlogPage() {
  return <BlogPageContent locale="tr" />
}
