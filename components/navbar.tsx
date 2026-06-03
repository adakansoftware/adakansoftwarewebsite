"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import { MagneticButton } from "@/components/magnetic-button"
import { MobileNavMenu } from "@/components/mobile-nav-menu"
import { NavbarDesktopActions } from "@/components/navbar-desktop-actions"
import { NavbarPrimaryLinks } from "@/components/navbar-primary-links"
import { whatsAppCopy } from "@/lib/contact-links"
import { getLocaleFromPathname, withLocale, type Locale } from "@/lib/i18n"
import { navbarContent } from "@/lib/shell-content"

export function Navbar({ locale: _locale }: { locale: Locale }) {
  const pathname = usePathname()
  const activeLocale = getLocaleFromPathname(pathname)
  const labels = navbarContent[activeLocale]
  const whatsApp = whatsAppCopy[activeLocale]
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const nextScrolled = window.scrollY > 80
      setIsScrolled((current) => (current === nextScrolled ? current : nextScrolled))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 right-0 left-0 z-[70] transition-all duration-500 ${
          isScrolled ? "py-4" : "py-6"
        } ${isScrolled ? "border-b border-white/[0.08] bg-background/80 backdrop-blur-[12px]" : "border-b border-border/20 bg-background/78 backdrop-blur-xl"}`}
        style={{ zIndex: 1000 }}
      >
        <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-6">
          <MagneticButton strength={0.15}>
            <Link href={withLocale("/", activeLocale)} className="flex items-center" aria-label={labels.homeLabel}>
              <Image
                src="/adakan-logo.png"
                alt="Adakan Software"
                width={128}
                height={84}
                priority
                className="h-9 w-auto drop-shadow-[0_0_18px_rgba(45,212,191,0.22)] md:h-10"
              />
            </Link>
          </MagneticButton>

          <div className="desktop-nav-shell absolute left-1/2 -translate-x-1/2 items-center gap-10">
            <NavbarPrimaryLinks links={labels.links} locale={activeLocale} pathname={pathname} />
          </div>

          <div className="desktop-nav-shell items-center gap-3">
            <NavbarDesktopActions
              locale={activeLocale}
              pathname={pathname}
              ctaLabel={labels.cta}
              whatsAppLabel={whatsApp.label}
              whatsAppShort={whatsApp.short}
            />
          </div>
        </div>
      </motion.nav>

      <MobileNavMenu
        locale={activeLocale}
        pathname={pathname}
        links={labels.links}
        ctaLabel={labels.cta}
        openMenuLabel={labels.openMenu}
        whatsAppLabel={whatsApp.label}
        whatsAppShort={whatsApp.short}
      />
    </>
  )
}
