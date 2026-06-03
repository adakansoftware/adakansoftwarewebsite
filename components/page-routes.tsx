import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react"

import { AboutCards } from "@/components/about-cards"
import { ContactForm } from "@/components/contact-form"
import { CTASection } from "@/components/cta-section"
import { MagneticButton } from "@/components/magnetic-button"
import { PageHeader } from "@/components/page-header"
import { PhilosophySection } from "@/components/philosophy-section"
import { ServiceDetailCards } from "@/components/service-detail-cards"
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
        <AboutCards cards={content.cards} />
      </section>
      <PhilosophySection locale={locale} />
      <CTASection locale={locale} />
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
          <ServiceDetailCards details={content.details} />

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
      <CTASection locale={locale} />
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
          {projects.map((project) => {
            const isExternalProject = project.href.startsWith("http://") || project.href.startsWith("https://")

            return (
              <article
                key={project.title}
                id={project.href.includes("#") ? project.href.split("#")[1] : undefined}
                className="group rounded-2xl border border-border/50 bg-card/25 p-6 backdrop-blur-md premium-border"
              >
                <div
                  className="relative mb-6 aspect-[4/3] overflow-hidden rounded-xl"
                  style={{ background: `linear-gradient(135deg, ${project.color}30, transparent 55%, ${project.color}18)` }}
                >
                  {project.coverImage ? (
                    <>
                      <Image
                        src={project.coverImage}
                        alt={`${project.title} kapak görseli`}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/25 to-background/15" />
                      <div className="absolute inset-0 grid-pattern opacity-10" />
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {project.category} / {project.year}
                    </p>
                    <h2 className="mt-3 text-3xl font-bold">{project.title}</h2>
                    <p className="mt-4 text-muted-foreground">{project.description}</p>
                    {isExternalProject ? (
                      <Link
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-foreground"
                      >
                        {locale === "tr" ? "Canlı siteyi aç" : "Open live site"}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                  <ArrowUpRight className="mt-2 h-5 w-5 text-primary transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </article>
            )
          })}
        </div>

        <div className="section-shell mt-12">
          <Link
            href={content.cta.href}
            className="group inline-flex items-center gap-2 rounded-full border border-border/50 px-6 py-3 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
          >
            {content.cta.label}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>
      <TestimonialsSection locale={locale} />
      <CTASection locale={locale} />
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
              <MagneticButton strength={0.22}>
                <Button asChild size="lg" className="group rounded-full bg-accent px-8 py-7 text-accent-foreground hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/20">
                  <a href={content.emailHref}>
                    {content.emailLabel}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Button>
              </MagneticButton>
              <MagneticButton strength={0.18}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="group rounded-full border-accent/35 bg-accent/5 px-8 py-7 text-accent hover:border-accent/60 hover:bg-accent hover:text-accent-foreground"
                >
                  <a href={getWhatsAppHref(locale)} target="_blank" rel="noreferrer">
                    {content.messagingLabel}
                    <MessageCircle className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                </Button>
              </MagneticButton>
            </div>
            <div className="mt-10 border-t border-border/30 pt-8">
              <ContactForm locale={locale} />
            </div>
          </div>

          <div className="space-y-4">
            {content.options.map((option) => (
              <Link
                key={option.title}
                href={option.href}
                className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/25 p-6 transition-colors hover:border-accent/50"
              >
                <option.icon className="h-5 w-5 text-accent" />
                <span>
                  <span className="block text-sm text-muted-foreground">{option.title}</span>
                  <span className="font-medium">{option.value}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <TestimonialsSection locale={locale} />
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
