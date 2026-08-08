import { ProjectsPageContent } from "@/components/page-routes"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("projects", "tr", "/projects")
export const revalidate = 60

export default function ProjectsPage() {
  return <ProjectsPageContent locale="tr" />
}
