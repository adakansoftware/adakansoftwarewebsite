import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react"

import { AboutCards } from "@/components/about-cards"
import { ContactForm } from "@/components/contact-form"
import { CTASection } from "@/components/cta-section"
import { LogoServiceCards } from "@/components/logo-service-cards"
import { MagneticButton } from "@/components/magnetic-button"
import { PageHeader } from "@/components/page-header"
import { PhilosophySection } from "@/components/philosophy-section"
import { ProjectListingCards } from "@/components/project-listing-cards"
import { ServiceDetailCards } from "@/components/service-detail-cards"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Button } from "@/components/ui/button"
import { getWhatsAppHref } from "@/lib/contact-links"
import type { Locale } from "@/lib/i18n"
import {
  getAboutPageContent,
  getApproachPageContent,
  getContactPageContent,
  getLogoPageContent,
  getProjectsPageContent,
  getServicesPageContent,
  getTestimonialsPageContent,
} from "@/lib/page-content"
import { getDemoExamples, getLogoWorks, getProjects, getServices } from "@/lib/site-data"

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
  const demoExamples = getDemoExamples(locale)
  const logoWorks = getLogoWorks(locale)

  return (
    <>
      <PageHeader locale={locale} {...content.header} />
      <section className="relative pb-32">
        <div className="section-shell">
          <ProjectListingCards projects={projects} locale={locale} />
        </div>

        <div className="section-shell mt-20">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-medium tracking-widest text-accent uppercase">{locale === "tr" ? "Demo Örnekler" : "Demo Examples"}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              {locale === "tr" ? "Canlı akışları hızlıca incele" : "Explore live flows quickly"}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {locale === "tr"
                ? "Hazır demo örnekleri; sektör, akış ve marka dili kararlarını canlı görmek için ayrı bir vitrin gibi çalışır."
                : "Demo examples act as a separate showcase for reviewing industry, flow, and brand language decisions live."}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {demoExamples.map((demo) => {
              const isExternalDemo = demo.href.startsWith("http://") || demo.href.startsWith("https://")

              return (
                <Link
                  key={demo.title}
                  href={demo.href}
                  target={isExternalDemo ? "_blank" : undefined}
                  rel={isExternalDemo ? "noreferrer" : undefined}
                  className="group rounded-2xl border border-border/50 bg-card/25 p-5 transition-colors hover:border-accent/45"
                >
                  <div
                    className="relative mb-5 aspect-[16/10] overflow-hidden rounded-xl"
                    style={{ background: `linear-gradient(135deg, ${demo.color}30, transparent 55%, ${demo.color}18)` }}
                  >
                    {demo.coverImage ? (
                      <>
                        <Image
                          src={demo.coverImage}
                          alt={`${demo.title} kapak görseli`}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover opacity-75 transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/25 to-transparent" />
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 grid-pattern opacity-20" />
                        <div className="absolute inset-x-5 top-6 rounded-xl border border-white/10 bg-background/35 p-4 backdrop-blur-md">
                          <span className="block h-3 w-1/2 rounded-full bg-white/25" />
                          <span className="mt-4 block h-10 rounded-lg" style={{ backgroundColor: `${demo.color}35` }} />
                        </div>
                      </>
                    )}
                    <div className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 backdrop-blur-md transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-xs font-medium tracking-widest text-accent uppercase">{demo.category}</p>
                  <h3 className="mt-3 text-xl font-bold">{demo.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{demo.description}</p>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="section-shell mt-20">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium tracking-widest text-accent uppercase">{locale === "tr" ? "Logo Çalışmaları" : "Logo Works"}</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                {locale === "tr" ? "Marka işaretleri ve kimlik denemeleri" : "Brand marks and identity studies"}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {locale === "tr"
                  ? "Logo çalışmalarını sadece tek bir görsel olarak değil; sembol, wordmark, renk ve kullanım ritmiyle birlikte gösteriyoruz."
                  : "Logo work is presented as more than a single visual: symbol, wordmark, color, and usage rhythm are considered together."}
              </p>
            </div>
            <Link
              href={locale === "tr" ? "/logo" : "/en/logo"}
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {locale === "tr" ? "Logo sayfasını aç" : "Open logo page"}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {logoWorks.map((work) => (
              <article key={work.title} className="group overflow-hidden rounded-2xl border border-border/50 bg-card/25 p-5 transition-colors hover:border-accent/45 premium-border">
                <div
                  className="relative mb-5 aspect-square overflow-hidden rounded-xl border border-white/10"
                  style={{ background: `linear-gradient(135deg, ${work.color}24, transparent 52%, ${work.color}14)` }}
                >
                  <div className="absolute inset-0 grid-pattern opacity-15" />
                  <div className="absolute inset-6 flex items-center justify-center rounded-2xl border border-white/10 bg-background/35 backdrop-blur-md">
                    <span className="font-aquire text-[clamp(2.8rem,8vw,4.8rem)] leading-none transition-transform duration-300 group-hover:scale-105" style={{ color: work.color }}>
                      {work.initials}
                    </span>
                  </div>
                  <div className="absolute right-4 bottom-4 h-2 w-16 rounded-full transition-transform duration-300 group-hover:scale-x-110" style={{ backgroundColor: work.color }} />
                </div>
                <p className="text-xs font-medium tracking-widest text-accent uppercase">{work.category}</p>
                <h3 className="mt-3 text-xl font-bold">{work.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{work.description}</p>
              </article>
            ))}
          </div>
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

export function LogoPageContent({ locale }: { locale: Locale }) {
  const content = getLogoPageContent(locale)

  return (
    <>
      <PageHeader locale={locale} {...content.header} />
      <section className="relative pb-32">
        <div className="section-shell">
          <LogoServiceCards sections={content.sections} />

          <div className="mt-12 overflow-hidden rounded-3xl border border-border/50 bg-background/40 p-8 premium-border md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-sm font-medium tracking-widest text-accent uppercase">{locale === "tr" ? "Logo sistemi" : "Logo system"}</p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                  {locale === "tr" ? "Tek logo değil, kullanılabilir marka seti" : "Not just one logo, a usable brand kit"}
                </h2>
                <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
                  {locale === "tr"
                    ? "Web sitesi, sosyal medya, teklif dosyası ve baskı gibi gerçek alanlarda çalışacak versiyonları baştan planlarız."
                    : "We plan versions that work across real touchpoints: website, social media, proposal decks, and print."}
                </p>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/50 bg-card/30">
                <div className="absolute inset-0 grid-pattern opacity-20" />
                <div className="absolute inset-8 flex items-center justify-center rounded-full border border-accent/25 bg-accent/10">
                  <span className="font-aquire text-[clamp(4rem,12vw,7rem)] leading-none text-accent">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
