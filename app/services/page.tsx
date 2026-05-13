import { ServicesPageContent } from "@/components/page-routes"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("services", "tr", "/services")

export default function ServicesPage() {
  return <ServicesPageContent locale="tr" />
}
