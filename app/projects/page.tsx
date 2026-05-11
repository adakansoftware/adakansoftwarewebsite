import { ProjectsPageContent } from "@/components/page-routes"
import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata({
  locale: "tr",
  title: "Projeler",
  description: "Web tasarımı, marka kimliği ve dijital ürün geliştirme işlerinin seçili örnekleri.",
  path: "/projects",
})

export default function ProjectsPage() {
  return <ProjectsPageContent locale="tr" />
}
