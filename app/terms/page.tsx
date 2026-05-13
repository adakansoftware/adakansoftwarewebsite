import { LegalPageContent } from "@/components/static-page-routes"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("terms", "tr", "/terms")

export default function TermsPage() {
  return <LegalPageContent locale="tr" type="terms" />
}
