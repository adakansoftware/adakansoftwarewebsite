import { ContactPageContent } from "@/components/page-routes"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("contact", "tr", "/contact")

export default function ContactPage() {
  return <ContactPageContent locale="tr" />
}
