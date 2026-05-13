"use client"

import Link from "next/link"

import { MagneticButton } from "@/components/magnetic-button"
import { withLocale, type Locale } from "@/lib/i18n"

type NavLink = {
  name: string
  href: string
}

export function NavbarPrimaryLinks({
  links,
  locale,
  pathname,
}: {
  links: readonly NavLink[]
  locale: Locale
  pathname: string
}) {
  const localizedHref = (href: string) => withLocale(href, locale)
  const isActive = (href: string) => pathname === localizedHref(href)

  return (
    <>
      {links.map((link) => (
        <div key={link.name}>
          <MagneticButton strength={0.1}>
            <Link
              href={localizedHref(link.href)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`group relative py-2 text-sm transition-colors ${
                isActive(link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.name}
              <span
                className={`absolute bottom-0 left-0 h-px bg-primary transition-all duration-300 ${
                  isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          </MagneticButton>
        </div>
      ))}
    </>
  )
}
