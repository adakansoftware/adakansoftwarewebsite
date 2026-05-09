import { PageHeader } from "@/components/page-header"
import { PhilosophySection } from "@/components/philosophy-section"
import { CTASection } from "@/components/cta-section"

export default function EnglishApproachPage() {
  return (
    <>
      <PageHeader
        eyebrow="Approach"
        title="Strategy first,"
        gradientText="craft second"
        description="We avoid work that looks good but does not connect to a goal. Every decision should have a reason for the brand, the user, and long-term maintainability."
        primaryHref="/en/contact"
        primaryLabel="Start a Project"
        secondaryHref="/en/services"
        secondaryLabel="View Services"
      />
      <PhilosophySection />
      <CTASection />
    </>
  )
}
