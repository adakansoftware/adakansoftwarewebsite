import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { getServices } from "@/lib/site-data"

const details = [
  {
    id: "web-design",
    title: "Web Design",
    outcome: "Fast, conversion-focused web experiences that strengthen the first impression.",
    items: ["Corporate websites", "Landing pages", "E-commerce storefronts", "SEO-friendly page architecture"],
  },
  {
    id: "brand-identity",
    title: "Brand Identity",
    outcome: "We bring logo, color, typography, and visual language into one coherent system.",
    items: ["Logo system", "Color and typography", "Social media templates", "Brand usage guide"],
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    outcome: "We simplify product flows and make user decisions easier.",
    items: ["SaaS dashboard design", "Mobile app interfaces", "Wireframes and prototypes", "User journeys"],
  },
  {
    id: "frontend",
    title: "Frontend Development",
    outcome: "We turn designs into performant and maintainable Next.js interfaces.",
    items: ["Next.js development", "Responsive implementation", "Motion systems", "Performance optimization"],
  },
]

export default function EnglishServicesPage() {
  const services = getServices("en")

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Clear solutions"
        gradientText="for every need"
        description="Instead of treating the site as a single showcase, we define each service area by its target, output, and business impact."
        primaryHref="/en/contact"
        primaryLabel="Start a Project"
        secondaryHref="/en/projects"
        secondaryLabel="View Projects"
      />

      <section className="relative pb-32">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-2">
            {details.map((service) => (
              <article key={service.id} id={service.id} className="rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md premium-border">
                <div className="mb-8 flex items-start justify-between gap-6">
                  <div>
                    <span className="text-sm text-primary">/ {service.id}</span>
                    <h2 className="mt-3 text-3xl font-bold">{service.title}</h2>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </div>
                <p className="mb-8 text-muted-foreground">{service.outcome}</p>
                <ul className="space-y-3">
                  {service.items.map((item) => (
                    <li key={item} className="border-t border-border/40 pt-3 text-sm text-foreground/85">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border/50 bg-background/40 p-8">
            <h2 className="text-2xl font-bold">Quick navigation</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {services.map((service) => (
                <Link key={service.title} href={service.href} className="rounded-full border border-border/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground">
                  {service.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
