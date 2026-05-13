import { CareersPageContent } from "@/components/static-page-routes"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("careers", "tr", "/careers")

export default function CareersPage() {
  return <CareersPageContent locale="tr" />
}
