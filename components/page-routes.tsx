import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowUpRight, MessageCircle } from "lucide-react"

import { AboutCards } from "@/components/about-cards"
import { ContactForm } from "@/components/contact-form"
import { CTASection } from "@/components/cta-section"
import { LogoServiceCards } from "@/components/logo-service-cards"
import { LogoShowcase } from "@/components/logo-showcase"
import { PageHeader } from "@/components/page-header"
import { PhilosophySection } from "@/components/philosophy-section"
import { ProjectListingCards } from "@/components/project-listing-cards"
import { ServiceDetailCards } from "@/components/service-detail-cards"
import { TestimonialsSection } from "@/components/testimonials-section"
import { getWhatsAppHref } from "@/lib/contact-links"
import type { Locale } from "@/lib/i18n"
import { getOptimizedLogoImage, getOptimizedProjectImage } from "@/lib/project-image-assets"
import {
  getAboutPageContent,
  getApproachPageContent,
  getContactPageContent,
  getLogoPageContent,
  getProjectsPageContent,
  getServicesPageContent,
  getTestimonialsPageContent,
} from "@/lib/page-content"
import { getDemoExamples, getServices } from "@/lib/site-data"
import { getManagedLogoWorks, getManagedProjects } from "@/lib/content"

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

          <div className="mt-6 rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(locale === "tr"
                ? [
                    {
                      step: "01",
                      title: "Keşif",
                      body: "Projenin hedefini, kullanıcıları ve kısıtları anlamak için kısa bir görüşme yapıyoruz.",
                    },
                    {
                      step: "02",
                      title: "Kapsam",
                      body: "48 saat içinde yazılı bir kapsam, takvim ve teklif sunuyoruz.",
                    },
                    {
                      step: "03",
                      title: "Tasarım & Geliştirme",
                      body: "Haftalar içinde teslim edeceğimiz çalışmaları paylaşıyor, geri bildirim alıyoruz.",
                    },
                    {
                      step: "04",
                      title: "Yayın",
                      body: "Teknik kurulum, domain yönlendirme ve yayın sonrası destek dahil teslim yapıyoruz.",
                    },
                  ]
                : [
                    {
                      step: "01",
                      title: "Discovery",
                      body: "A short call to understand your goals, users, and constraints.",
                    },
                    {
                      step: "02",
                      title: "Scope",
                      body: "A written scope, timeline, and proposal delivered within 48 hours.",
                    },
                    {
                      step: "03",
                      title: "Design & Build",
                      body: "We share deliverables week by week and collect feedback.",
                    },
                    {
                      step: "04",
                      title: "Launch",
                      body: "Delivery includes technical setup, domain routing, and post-launch support.",
                    },
                  ]
              ).map((item) => (
                <div key={item.step} className="space-y-2">
                  <span className="font-mono text-xs text-accent">{item.step}</span>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md">
            <p className="max-w-2xl text-muted-foreground">
              {locale === "tr"
                ? "Proje kapsamı ve karmaşıklığına göre değişir. Aşağıdaki aralıklar başlangıç noktası olarak kullanılabilir; kesin teklif kapsam görüşmesinin ardından sunulur."
                : "Varies by scope and complexity. The ranges below are a starting point; exact pricing follows a scope call."}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {(locale === "tr"
                ? [
                    { service: "Logo & Marka Kimliği", range: "₺15.000 - ₺35.000" },
                    { service: "Kurumsal Web Sitesi", range: "₺25.000 - ₺75.000" },
                    { service: "UI/UX & Frontend", range: "₺40.000 - ₺120.000" },
                  ]
                : [
                    { service: "Logo & Brand Identity", range: "€800 - €2.000" },
                    { service: "Corporate Website", range: "€1.500 - €5.000" },
                    { service: "UI/UX & Frontend", range: "€3.000 - €10.000" },
                  ]
              ).map((item) => (
                <div key={item.service} className="rounded-xl border border-border/40 bg-background/35 p-5">
                  <p className="text-sm text-muted-foreground">{item.service}</p>
                  <p className="mt-2 text-xl font-bold">{item.range}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CTASection locale={locale} />
    </>
  )
}

export async function ProjectsPageContent({ locale }: { locale: Locale }) {
  const content = getProjectsPageContent(locale)
  const projects = await getManagedProjects(locale)
  const demoExamples = getDemoExamples(locale)
  const logoWorks = await getManagedLogoWorks(locale)

  return (
    <>
      <PageHeader locale={locale} {...content.header} />
      <section className="relative pb-32">
        <div className="section-shell">
          <ProjectListingCards projects={projects} locale={locale} />
        </div>

        <div className="section-shell mt-20">
          <div className="mb-8 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
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
                          src={getOptimizedProjectImage(demo.coverImage)}
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
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
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
                    {work.logoImage ? (
                      <Image
                        src={getOptimizedLogoImage(work.logoImage)}
                        alt={`${work.title} logo`}
                        width={320}
                        height={180}
                        className={`h-auto max-h-[72%] w-[82%] object-contain transition-transform duration-300 group-hover:scale-105 ${
                          work.title === "Salihoğulları Hafriyat" ? "-translate-y-3" : ""
                        }`}
                      />
                    ) : (
                      <span className="font-aquire text-[clamp(2.8rem,8vw,4.8rem)] leading-none transition-transform duration-300 group-hover:scale-105" style={{ color: work.color }}>
                        {work.initials}
                      </span>
                    )}
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

export async function LogoPageContent({ locale }: { locale: Locale }) {
  const content = getLogoPageContent(locale)
  const logoWorks = await getManagedLogoWorks(locale)

  return (
    <>
      <PageHeader locale={locale} {...content.header} />
      <section className="relative pb-32">
        <div className="section-shell">
          <LogoServiceCards sections={content.sections} />

          <div className="mt-12 overflow-hidden rounded-3xl border border-border/50 bg-background/40 p-8 premium-border md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
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
        <LogoShowcase locale={locale} works={logoWorks} />
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

            <div className="mt-8">
              <ContactForm locale={locale} />
            </div>

            <div className="mt-8 border-t border-border/30 pt-6">
              <p className="mb-4 text-sm text-muted-foreground">{locale === "tr" ? "Ya da doğrudan ulaş:" : "Or reach us directly:"}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={content.emailHref}
                  className="inline-flex items-center gap-2 rounded-full border border-border/50 px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <ArrowRight className="h-4 w-4" />
                  {content.emailLabel}
                </a>
                <a
                  href={getWhatsAppHref(locale)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={content.messagingLabel}
                  className="inline-flex items-center gap-2 rounded-full border border-border/50 px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <MessageCircle className="h-4 w-4" />
                  {content.messagingLabel}
                </a>
              </div>
            </div>

            <div className="mt-8 border-t border-border/30 pt-6">
              <div className="flex flex-wrap gap-2">
                {content.tags.map((item) => (
                  <span key={item} className="rounded-full border border-border/40 bg-background/35 px-3 py-1.5 text-xs text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {content.options.map((option) => (
              <Link
                key={option.title}
                href={option.href}
                className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card/25 p-6 transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
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
