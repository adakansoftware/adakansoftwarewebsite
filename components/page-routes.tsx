import Link from "next/link"
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react"

import { CTASection } from "@/components/cta-section"
import { PageHeader } from "@/components/page-header"
import { PhilosophySection } from "@/components/philosophy-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Button } from "@/components/ui/button"
import { getWhatsAppHref } from "@/lib/contact-links"
import type { Locale } from "@/lib/i18n"
import {
  getAboutPageContent,
  getApproachPageContent,
  getContactPageContent,
  getProjectsPageContent,
  getServicesPageContent,
  getTestimonialsPageContent,
} from "@/lib/page-content"
import { getProjects, getServices } from "@/lib/site-data"

export function AboutPageContent({ locale }: { locale: Locale }) {
  const content = getAboutPageContent(locale)

  return (
    <>
      <PageHeader locale={locale} {...content.header} />
      <section className="relative pb-32">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          {content.cards.map((card) => (
            <article key={card.title} className="rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md">
              <h2 className="text-2xl font-bold">{card.title}</h2>
              <p className="mt-4 text-muted-foreground">{card.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export function ApproachPageContent({ locale }: { locale: Locale }) {
  const content = getApproachPageContent(locale)

  return (
    <>
      <PageHeader locale={locale} {...content.header} />
      <PhilosophySection locale={locale} />
      <CTASection locale={locale} />
    </>
  )
}

export function ServicesPageContent({ locale }: { locale: Locale }) {
  const content = getServicesPageContent(locale)
  const services = getServices(locale)

  return (
    <>
      <PageHeader locale={locale} {...content.header} />
      <section className="relative pb-32">
        <div className="section-shell">
          <div className="grid gap-6 lg:grid-cols-2">
            {content.details.map((service) => (
              <article
                key={service.id}
                id={service.id}
                className="premium-border rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md"
              >
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
            <h2 className="text-2xl font-bold">{content.detailsTitle}</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {services.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="rounded-full border border-border/50 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                >
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

export function ProjectsPageContent({ locale }: { locale: Locale }) {
  const content = getProjectsPageContent(locale)
  const projects = getProjects(locale)

  return (
    <>
      <PageHeader locale={locale} {...content.header} />
      <section className="relative pb-32">
        <div className="section-shell grid gap-8 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.title}
              id={project.href.split("#")[1]}
              className="group rounded-2xl border border-border/50 bg-card/25 p-6 backdrop-blur-md premium-border"
            >
              <div
                className="relative mb-6 aspect-[4/3] overflow-hidden rounded-xl"
                style={{ background: `linear-gradient(135deg, ${project.color}30, transparent 55%, ${project.color}18)` }}
              >
                <div className="absolute inset-0 grid-pattern opacity-25" />
                <div className="absolute inset-x-6 top-8 rounded-xl border border-white/10 bg-background/35 p-5 backdrop-blur-md">
                  <div className="mb-5 flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-400/80" />
                    <span className="h-2 w-2 rounded-full bg-amber-300/80" />
                    <span className="h-2 w-2 rounded-full bg-emerald-300/80" />
                  </div>
                  <div className="space-y-3">
                    <span className="block h-3 w-1/2 rounded-full bg-white/25" />
                    <span className="block h-10 rounded-lg" style={{ backgroundColor: `${project.color}35` }} />
                    <span className="block h-3 w-2/3 rounded-full bg-white/15" />
                  </div>
                </div>
              </div>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {project.category} / {project.year}
                  </p>
                  <h2 className="mt-3 text-3xl font-bold">{project.title}</h2>
                  <p className="mt-4 text-muted-foreground">{project.description}</p>
                </div>
                <ArrowUpRight className="mt-2 h-5 w-5 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            </article>
          ))}
        </div>

        <div className="section-shell mt-12">
          <Link
            href={content.cta.href}
            className="inline-flex items-center gap-2 rounded-full border border-border/50 px-6 py-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {content.cta.label}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}

export function ContactPageContent({ locale }: { locale: Locale }) {
  const content = getContactPageContent(locale)

  return (
    <>
      <PageHeader locale={locale} {...content.header} />
      <section className="relative pb-32">
        <div className="section-shell grid gap-8 lg:grid-cols-3">
          <div className="premium-border rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md lg:col-span-2">
            <h2 className="text-3xl font-bold">{content.noteTitle}</h2>
            <p className="mt-4 text-muted-foreground">{content.noteDescription}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {content.tags.map((item) => (
                <span key={item} className="rounded-xl border border-border/50 bg-background/35 px-4 py-3 text-sm">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full bg-foreground px-8 py-7 text-background hover:bg-foreground/90">
                <a href={content.emailHref}>
                  {content.emailLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary/35 bg-primary/5 px-8 py-7 text-primary hover:border-primary/60 hover:bg-primary hover:text-background"
              >
                <a href={getWhatsAppHref(locale)} target="_blank" rel="noreferrer">
                  {content.messagingLabel}
                  <MessageCircle className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {content.options.map((option) => (
              <Link
                key={option.title}
                href={option.href}
                className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/25 p-6 transition-colors hover:border-primary/50"
              >
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

export function TestimonialsPageContent({ locale }: { locale: Locale }) {
  const content = getTestimonialsPageContent(locale)

  return (
    <>
      <PageHeader locale={locale} {...content.header} />
      <TestimonialsSection locale={locale} />
      <CTASection locale={locale} />
    </>
  )
}
