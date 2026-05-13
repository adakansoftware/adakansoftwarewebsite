"use client"

import Link from "next/link"
import { ArrowUpRight, MessageCircle } from "lucide-react"

import { MagneticButton } from "@/components/magnetic-button"
import { Button } from "@/components/ui/button"
import { getWhatsAppHref } from "@/lib/contact-links"
import { switchLocalePath, withLocale, type Locale } from "@/lib/i18n"

export function NavbarDesktopActions({
  locale,
  pathname,
  ctaLabel,
  whatsAppLabel,
  whatsAppShort,
}: {
  locale: Locale
  pathname: string
  ctaLabel: string
  whatsAppLabel: string
  whatsAppShort: string
}) {
  const localizedHref = (href: string) => withLocale(href, locale)

  return (
    <>
      <MagneticButton strength={0.16}>
        <a
          href={getWhatsAppHref(locale)}
          aria-label={whatsAppLabel}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 text-xs font-medium text-primary backdrop-blur-md transition-all duration-300 hover:border-primary/60 hover:bg-primary hover:text-background hover:shadow-[0_0_28px_rgba(45,212,191,0.22)]"
        >
          <MessageCircle className="h-4 w-4" />
          {whatsAppShort}
        </a>
      </MagneticButton>
      <Link
        href={switchLocalePath(pathname, "tr")}
        aria-current={locale === "tr" ? "true" : undefined}
        className={`rounded-full px-3 py-1 text-xs transition-colors ${
          locale === "tr" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        TR
      </Link>
      <Link
        href={switchLocalePath(pathname, "en")}
        aria-current={locale === "en" ? "true" : undefined}
        className={`rounded-full px-3 py-1 text-xs transition-colors ${
          locale === "en" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </Link>
      <MagneticButton strength={0.2}>
        <Button asChild className="rounded-full bg-foreground px-6 text-background transition-colors duration-300 hover:bg-foreground/90">
          <Link href={localizedHref("/contact")}>
            {ctaLabel}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </MagneticButton>
    </>
  )
}
