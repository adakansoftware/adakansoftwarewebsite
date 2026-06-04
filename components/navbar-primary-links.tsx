"use client"

import Link from "next/link"
import { motion } from "framer-motion"

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
  const isActive = (href: string) => {
    const localized = localizedHref(href)
    return pathname === localized || (href !== "/" && pathname.startsWith(`${localized}/`))
  }

  return (
    <>
      {links.map((link) => (
        <div key={link.name} className="relative">
          <MagneticButton strength={0.1}>
            <Link
              href={localizedHref(link.href)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`group relative py-2 text-sm transition-colors ${
                isActive(link.href) ? "text-foreground" : "text-muted-foreground hover:text-accent"
              }`}
            >
              {link.name}
              <span
                className={`absolute bottom-0 left-0 h-px bg-accent transition-all duration-300 ${
                  isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
              {isActive(link.href) ? (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                />
              ) : null}
            </Link>
          </MagneticButton>
        </div>
      ))}
    </>
  )
}
