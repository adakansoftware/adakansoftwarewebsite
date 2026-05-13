import { TestimonialsPageContent } from "@/components/page-routes"
import { createRouteMetadata } from "@/lib/metadata"

export const metadata = createRouteMetadata("testimonials", "tr", "/testimonials")

export default function TestimonialsPage() {
  return <TestimonialsPageContent locale="tr" />
}
