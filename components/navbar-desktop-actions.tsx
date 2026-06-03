"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Check, Languages, MessageCircle } from "lucide-react"

import { MagneticButton } from "@/components/magnetic-button"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getWhatsAppHref } from "@/lib/contact-links"
import { getLocaleFromPathname, switchLocalePath, withLocale, type Locale } from "@/lib/i18n"

export function NavbarDesktopActions({
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
  const activeLocale = getLocaleFromPathname(pathname)
  const localizedHref = (href: string) => withLocale(href, activeLocale)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)

  useEffect(() => {
    setIsLanguageOpen(false)
  }, [activeLocale, pathname])

  return (
    <>
      <MagneticButton strength={0.16}>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={getWhatsAppHref(activeLocale)}
              aria-label={whatsAppLabel}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-accent/25 bg-accent/5 text-accent backdrop-blur-md transition-all duration-300 hover:border-accent/60 hover:bg-accent hover:text-accent-foreground hover:shadow-[0_0_28px_color-mix(in_oklab,var(--accent)_30%,transparent)]"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </TooltipTrigger>
          <TooltipContent sideOffset={8}>{whatsAppShort}</TooltipContent>
        </Tooltip>
      </MagneticButton>

      <DropdownMenu open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border/50 bg-card/20 px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/45 hover:text-foreground"
            aria-label={activeLocale === "tr" ? "Dil seçimi" : "Language selector"}
          >
            <Languages className="h-4 w-4" />
            {activeLocale.toUpperCase()}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={12} className="z-[1400] min-w-24 border-border/50 bg-popover/95 backdrop-blur-xl">
          <DropdownMenuItem asChild>
            <Link href={switchLocalePath(pathname, "tr")} aria-current={activeLocale === "tr" ? "true" : undefined} onClick={() => setIsLanguageOpen(false)}>
              TR
              {activeLocale === "tr" ? <Check className="ml-auto h-4 w-4 text-accent" /> : null}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={switchLocalePath(pathname, "en")} aria-current={activeLocale === "en" ? "true" : undefined} onClick={() => setIsLanguageOpen(false)}>
              EN
              {activeLocale === "en" ? <Check className="ml-auto h-4 w-4 text-accent" /> : null}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MagneticButton strength={0.2}>
        <Button asChild className="rounded-full bg-accent px-6 text-accent-foreground transition-colors duration-300 hover:bg-accent/90">
          <Link href={localizedHref("/contact")}>
            {ctaLabel}
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </MagneticButton>
    </>
  )
}
