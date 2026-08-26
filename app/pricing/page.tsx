import { PageHeader } from "@/components/page-header"
import { PricingSection } from "@/components/pricing-section"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("pricing", "tr", "/pricing")

export default function PricingPage() {
  return <><PageHeader locale="tr" title="Net kapsam," gradientText="net yatırım" description="İhtiyacına uygun başlangıç paketini seç; proje kapsamını birlikte netleştirelim." /><PricingSection locale="tr" /></>
}
