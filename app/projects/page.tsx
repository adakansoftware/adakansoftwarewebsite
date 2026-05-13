import { ProjectsPageContent } from "@/components/page-routes"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("projects", "tr", "/projects")

export default function ProjectsPage() {
  return <ProjectsPageContent locale="tr" />
}
