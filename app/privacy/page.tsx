import { LegalPageContent } from "@/components/static-page-routes"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("privacy", "tr", "/privacy")

export default function PrivacyPage() {
  return <LegalPageContent locale="tr" type="privacy" />
}
