"use client"

import Link from "next/link"
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getWhatsAppHref } from "@/lib/contact-links"
import { switchLocalePath, withLocale, type Locale } from "@/lib/i18n"

type NavLink = {
  name: string
  href: string
}

export function MobileNavMenu({
  locale,
  pathname,
  links,
  ctaLabel,
  openMenuLabel,
  whatsAppLabel,
  whatsAppShort,
}: {
  locale: Locale
  pathname: string
  links: readonly NavLink[]
  ctaLabel: string
  openMenuLabel: string
  whatsAppLabel: string
  whatsAppShort: string
}) {
  const localizedHref = (href: string) => withLocale(href, locale)
  const closeNativeMobileMenu = () => {
    document.querySelector<HTMLDetailsElement>("[data-mobile-menu]")?.removeAttribute("open")
  }

  return (
    <details className="mobile-menu-native fixed top-6 right-5 flex shrink-0 lg:hidden" data-mobile-menu>
      <summary className="relative inline-flex h-12 w-12 touch-manipulation items-center justify-center rounded-full border border-white/10 bg-background/70 text-foreground backdrop-blur-xl">
        <span className="sr-only">{openMenuLabel}</span>
        <Menu size={24} className="mobile-menu-open-icon" />
        <X size={24} className="mobile-menu-close-icon" />
      </summary>
      <div id="mobile-navigation" className="fixed inset-0 bg-background" style={{ zIndex: 2147483646 }} role="dialog" aria-modal="true">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.76_0.13_174_/_0.16),transparent_34%),radial-gradient(circle_at_80%_15%,oklch(0.78_0.14_74_/_0.12),transparent_32%)]" />
        <div className="relative h-full overflow-y-auto px-6 pt-28 pb-10">
          <div className="flex flex-col gap-8">
            {links.map((link) => (
              <Link key={link.name} href={localizedHref(link.href)} className="text-4xl leading-tight font-bold text-foreground" onClick={closeNativeMobileMenu}>
                {link.name}
              </Link>
            ))}
            <div className="flex gap-3">
              <Link href={switchLocalePath(pathname, "tr")} onClick={closeNativeMobileMenu} className="rounded-full border border-border/50 px-4 py-2 text-sm">
                TR
              </Link>
              <Link href={switchLocalePath(pathname, "en")} onClick={closeNativeMobileMenu} className="rounded-full border border-border/50 px-4 py-2 text-sm">
                EN
              </Link>
            </div>
            <a
              href={getWhatsAppHref(locale)}
              aria-label={whatsAppLabel}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-primary/35 bg-primary/10 px-5 py-3 text-primary"
              onClick={closeNativeMobileMenu}
            >
              <MessageCircle className="h-5 w-5" />
              {whatsAppShort}
            </a>
            <div className="mt-8">
              <Button asChild className="w-full rounded-full bg-foreground py-6 text-lg text-background">
                <Link href={localizedHref("/contact")} onClick={closeNativeMobileMenu}>
                  {ctaLabel}
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </details>
  )
}
