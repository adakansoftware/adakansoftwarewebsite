import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import type { Locale } from "@/lib/i18n"
import { careersPageContent, blogPageContent, legalPageContent } from "@/lib/static-page-content"
import { siteConfig } from "@/lib/site-config"

export function BlogPageContent({ locale }: { locale: Locale }) {
  const copy = blogPageContent[locale]

  return (
    <>
      <PageHeader locale={locale} {...copy} />
      <section className="relative pb-32">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          {copy.posts.map((post) => (
            <Link
              key={post}
              href={copy.ctaHref}
              className="group rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md transition-colors hover:border-primary/50"
            >
              <span className="text-sm text-primary">{copy.badge}</span>
              <h2 className="mt-4 text-2xl font-bold">{post}</h2>
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground">
                {copy.ctaLabel}
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
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
          <Link href={`mailto:${siteConfig.email}`} className="mt-8 inline-flex items-center gap-2 text-primary">
            {siteConfig.email}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
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
    </>
  )
}
