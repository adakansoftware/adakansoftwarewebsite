import { PageHeader } from "@/components/page-header"
import { PricingSection } from "@/components/pricing-section"
import { createPageMetadata } from "@/lib/metadata"

export const metadata = createPageMetadata({
  locale: "tr",
  title: "Fiyatlandırma",
  description: "Web tasarım, marka kimliği ve dijital ürün projeleri için başlangıç fiyat aralıkları.",
  path: "/pricing",
})

export default function PricingPage() {
  return <><PageHeader locale="tr" title="Net kapsam," gradientText="net yatırım" description="İhtiyacına uygun başlangıç paketini seç; proje kapsamını birlikte netleştirelim." /><PricingSection locale="tr" /></>
}
