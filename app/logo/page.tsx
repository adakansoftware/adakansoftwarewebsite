import { LogoPageContent } from "@/components/page-routes"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("logo", "tr", "/logo")
export const revalidate = 60

export default function LogoPage() {
  return <LogoPageContent locale="tr" />
}
