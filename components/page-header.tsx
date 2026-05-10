import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Locale } from "@/lib/i18n"

type PageHeaderProps = {
  locale?: Locale
  eyebrow: string
  title: string
  gradientText?: string
  description: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}

export function PageHeader({
  locale = "tr",
  eyebrow,
  title,
  gradientText,
  description,
  primaryHref = "/contact",
  primaryLabel = locale === "en" ? "Start a Project" : "Projeye Başla",
  secondaryHref,
  secondaryLabel,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden pb-20 pt-36 md:pb-28 md:pt-44">
      <div className="absolute inset-0 grid-pattern opacity-10" />
      <div className="section-shell">
        <div className="max-w-4xl">
          <span className="eyebrow mb-6 block">{eyebrow}</span>
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
            {title}
            {gradientText ? (
              <>
                <br />
                <span className="text-gradient">{gradientText}</span>
              </>
            ) : null}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">{description}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-foreground px-8 py-7 text-background hover:bg-foreground/90"
            >
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {secondaryHref && secondaryLabel ? (
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="rounded-full px-8 py-7 text-muted-foreground hover:text-foreground"
              >
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
