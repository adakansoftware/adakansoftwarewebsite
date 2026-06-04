import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { CTASection } from "@/components/cta-section"
import { PageHeader } from "@/components/page-header"
import type { Locale } from "@/lib/i18n"
import { careersPageContent, blogPageContent, legalPageContent } from "@/lib/static-page-content"
import { siteConfig } from "@/lib/site-config"

export function BlogPageContent({ locale }: { locale: Locale }) {
  const copy = blogPageContent[locale]
  const label = locale === "tr" ? "E-bülten" : "Newsletter"
  const bodyText =
    locale === "tr"
      ? "Tasarım, marka ve frontend geliştirme üzerine ara sıra pratik notlar paylaşıyoruz. Haberdar olmak için e-posta bırak."
      : "We occasionally share practical notes on design, brand strategy, and frontend development. Leave your email to stay updated."
  const buttonLabel = locale === "tr" ? "Kayıt Ol" : "Subscribe"
  const subject = encodeURIComponent(locale === "tr" ? "E-bülten kaydı" : "Newsletter signup")

  return (
    <>
      <PageHeader locale={locale} {...copy} />
      <section className="relative pb-32">
        <div className="section-shell max-w-2xl">
          <div className="rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md md:p-10">
            <span className="text-xs font-medium tracking-widest text-accent uppercase">{label}</span>
            <h2 className="mt-4 text-2xl font-bold">{bodyText}</h2>
            <a
              href={`mailto:${siteConfig.email}?subject=${subject}`}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              {buttonLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
      <CTASection locale={locale} />
    </>
  )
}

export function CareersPageContent({ locale }: { locale: Locale }) {
  const copy = careersPageContent[locale]

  return (
    <>
      <PageHeader locale={locale} {...copy} />
      <section className="relative pb-32">
        <div className="section-shell rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md">
          <h2 className="text-2xl font-bold">{copy.sectionTitle}</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">{copy.sectionDescription}</p>
          <Link href={`mailto:${siteConfig.email}`} className="group mt-8 inline-flex items-center gap-2 text-accent">
            {siteConfig.email}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
      <CTASection locale={locale} />
    </>
  )
}

export function LegalPageContent({
  locale,
  type,
}: {
  locale: Locale
  type: "privacy" | "terms"
}) {
  const copy = legalPageContent[type][locale]

  return (
    <>
      <PageHeader locale={locale} {...copy} />
      <section className="relative pb-32">
        <div className="section-shell max-w-3xl space-y-6 text-muted-foreground">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <CTASection locale={locale} />
    </>
  )
}
