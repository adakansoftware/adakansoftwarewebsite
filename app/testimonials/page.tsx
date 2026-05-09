import { PageHeader } from "@/components/page-header"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Yorumlar"
        title="İş ortaklarımızdan"
        gradientText="gerçek geri bildirimler"
        description="Tasarımın kalitesi kadar sürecin netliği de önemli. İş ortaklarımızın öne çıkardığı şey; anlaşılır iletişim, doğru öncelik ve teslim sonrası kullanılabilirlik."
        secondaryHref="/projects"
        secondaryLabel="Projeleri İncele"
      />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
