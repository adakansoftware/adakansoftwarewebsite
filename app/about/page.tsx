import { AboutPageContent } from "@/components/page-routes"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("about", "tr", "/about")

export default function AboutPage() {
  return <AboutPageContent locale="tr" />
}
