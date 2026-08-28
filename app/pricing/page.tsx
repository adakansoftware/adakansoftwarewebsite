import { PageHeader } from "@/components/page-header"
import { PageJsonLd } from "@/components/page-json-ld"
import { PricingSection } from "@/components/pricing-section"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("pricing", "tr", "/pricing")

export default function PricingPage() {
  return <><PageJsonLd locale="tr" path="/pricing" /><PageHeader locale="tr" title="Net kapsam," gradientText="net yatırım" description="İhtiyacına uygun başlangıç paketini seç; proje kapsamını birlikte netleştirelim." /><PricingSection locale="tr" /></>
}
