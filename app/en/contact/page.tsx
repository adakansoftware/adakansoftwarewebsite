import Link from "next/link"
import { ArrowRight, Mail, MapPin, MessageCircle } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { getWhatsAppHref } from "@/lib/contact-links"

const contactOptions = [
  {
    title: "Email",
    value: "merhaba@adakan.com.tr",
    href: "mailto:merhaba@adakan.com.tr?subject=New%20project%20inquiry",
    icon: Mail,
  },
  {
    title: "Location",
    value: "Istanbul, Turkey",
    href: "/en/about",
    icon: MapPin,
  },
]

export default function EnglishContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's clarify"
        gradientText="your project"
        description="For your new website, brand identity, or digital product, let's define goals, scope, and the first delivery plan together."
        primaryHref="mailto:merhaba@adakan.com.tr?subject=New%20project%20inquiry"
        primaryLabel="Send Email"
        secondaryHref="/en/services"
        secondaryLabel="View Services"
      />

      <section className="relative pb-32">
        <div className="section-shell grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md premium-border">
            <h2 className="text-3xl font-bold">A short note is enough to start</h2>
            <p className="mt-4 text-muted-foreground">
              Include the project type, your current website if available, target timeline, and expectations.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Website", "Brand identity", "UI/UX", "Frontend development"].map((item) => (
                <span key={item} className="rounded-xl border border-border/50 bg-background/35 px-4 py-3 text-sm">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-foreground px-8 py-7 text-background hover:bg-foreground/90">
                <a href="mailto:merhaba@adakan.com.tr?subject=New%20project%20inquiry">
                  merhaba@adakan.com.tr
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary/35 bg-primary/5 px-8 py-7 text-primary hover:border-primary/60 hover:bg-primary hover:text-background"
              >
                <a href={getWhatsAppHref("en")} target="_blank" rel="noreferrer">
                  WhatsApp
                  <MessageCircle className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {contactOptions.map((option) => (
              <Link key={option.title} href={option.href} className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/25 p-6 transition-colors hover:border-primary/50">
                <option.icon className="h-5 w-5 text-primary" />
                <span>
                  <span className="block text-sm text-muted-foreground">{option.title}</span>
                  <span className="font-medium">{option.value}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
