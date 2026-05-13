import { ApproachPageContent } from "@/components/page-routes"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("approach", "tr", "/approach")

export default function ApproachPage() {
  return <ApproachPageContent locale="tr" />
}
