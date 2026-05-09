import { PageHeader } from "@/components/page-header"
import { PhilosophySection } from "@/components/philosophy-section"
import { CTASection } from "@/components/cta-section"

export default function ApproachPage() {
  return (
    <>
      <PageHeader
        eyebrow="Yaklaşımımız"
        title="Önce strateji,"
        gradientText="sonra zanaat"
        description="Güzel görünen ama hedefe bağlanmayan işlerden kaçınırız. Her kararın marka, kullanıcı ve teknik sürdürülebilirlik tarafında bir nedeni olmalı."
        secondaryHref="/services"
        secondaryLabel="Hizmetleri Gör"
      />
      <PhilosophySection />
      <CTASection />
    </>
  )
}
