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
import { withLocale, type Locale } from "@/lib/i18n"
import { navbarContent } from "@/lib/shell-content"

export function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const labels = navbarContent[locale]
  const whatsApp = whatsAppCopy[locale]
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const nextScrolled = window.scrollY > 50
      setIsScrolled((current) => (current === nextScrolled ? current : nextScrolled))
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 right-0 left-0 z-[70] border-b border-border/20 bg-background/78 backdrop-blur-xl transition-all duration-500 ${
        isScrolled ? "py-4" : "py-6"
      }`}
      style={{ zIndex: 1000 }}
    >
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-6">
        <MagneticButton strength={0.15}>
          <Link href={withLocale("/", locale)} className="flex items-center" aria-label={labels.homeLabel}>
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
          <NavbarPrimaryLinks links={labels.links} locale={locale} pathname={pathname} />
        </div>

        <div className="desktop-nav-shell items-center gap-3">
          <NavbarDesktopActions
            locale={locale}
            pathname={pathname}
            ctaLabel={labels.cta}
            whatsAppLabel={whatsApp.label}
            whatsAppShort={whatsApp.short}
          />
        </div>

        <MobileNavMenu
          locale={locale}
          pathname={pathname}
          links={labels.links}
          ctaLabel={labels.cta}
          openMenuLabel={labels.openMenu}
          whatsAppLabel={whatsApp.label}
          whatsAppShort={whatsApp.short}
        />
      </div>
    </motion.nav>
  )
}
