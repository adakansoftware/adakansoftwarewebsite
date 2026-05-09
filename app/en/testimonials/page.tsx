import { PageHeader } from "@/components/page-header"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CTASection } from "@/components/cta-section"

export default function EnglishTestimonialsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Testimonials"
        title="Real feedback"
        gradientText="from partners"
        description="The quality of the process matters as much as the quality of design. Our partners value clear communication, right priorities, and usable delivery."
        primaryHref="/en/contact"
        primaryLabel="Start a Project"
        secondaryHref="/en/projects"
        secondaryLabel="View Projects"
      />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
