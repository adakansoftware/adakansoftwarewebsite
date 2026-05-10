"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Menu, MessageCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { MagneticButton } from "@/components/magnetic-button"
import { getWhatsAppHref, whatsAppCopy } from "@/lib/contact-links"
import { getLocaleFromPathname, switchLocalePath, withLocale, type Locale } from "@/lib/i18n"

const navLabels = {
  tr: {
    links: [
      { name: "Hizmetler", href: "/services" },
      { name: "Projeler", href: "/projects" },
      { name: "Yaklaşımımız", href: "/approach" },
      { name: "Yorumlar", href: "/testimonials" },
    ],
    cta: "Projeye Başla",
    homeLabel: "Adakan Software ana sayfa",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
  },
  en: {
    links: [
      { name: "Services", href: "/services" },
      { name: "Projects", href: "/projects" },
      { name: "Approach", href: "/approach" },
      { name: "Testimonials", href: "/testimonials" },
    ],
    cta: "Start a Project",
    homeLabel: "Adakan Software home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
} satisfies Record<Locale, {
  links: Array<{ name: string; href: string }>
  cta: string
  homeLabel: string
  openMenu: string
  closeMenu: string
}>

export function Navbar() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const labels = navLabels[locale]
  const whatsApp = whatsAppCopy[locale]
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const localizedHref = (href: string) => withLocale(href, locale)
  const isActive = (href: string) => pathname === localizedHref(href)

  return (
    <>
      <motion.nav
        initial={false}
        animate={{ y: 0, opacity: 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "py-4 backdrop-blur-xl bg-background/78 border-b border-border/20" : "py-6"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 sm:px-6">
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

          <div className="hidden lg:flex items-center gap-10">
            {labels.links.map((link, index) => (
              <motion.div
                key={link.name}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <MagneticButton strength={0.1}>
                  <Link
                    href={localizedHref(link.href)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`text-sm transition-colors relative group py-2 ${
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
              </motion.div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <MagneticButton strength={0.16}>
              <a
                href={getWhatsAppHref(locale)}
                aria-label={whatsApp.label}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 text-xs font-medium text-primary backdrop-blur-md transition-all duration-300 hover:border-primary/60 hover:bg-primary hover:text-background hover:shadow-[0_0_28px_rgba(45,212,191,0.22)]"
              >
                <MessageCircle className="h-4 w-4" />
                {whatsApp.short}
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
              <Button asChild className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 transition-colors duration-300">
                <Link href={localizedHref("/contact")}>
                  {labels.cta}
                  <ArrowUpRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </MagneticButton>
          </div>

          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? labels.closeMenu : labels.openMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-background pt-24 px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-8"
              >
                {labels.links.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={localizedHref(link.href)}
                      className="text-4xl font-bold text-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="flex gap-3">
                  <Link href={switchLocalePath(pathname, "tr")} onClick={() => setIsMobileMenuOpen(false)} className="rounded-full border border-border/50 px-4 py-2 text-sm">
                    TR
                  </Link>
                  <Link href={switchLocalePath(pathname, "en")} onClick={() => setIsMobileMenuOpen(false)} className="rounded-full border border-border/50 px-4 py-2 text-sm">
                    EN
                  </Link>
                </div>
                <a
                  href={getWhatsAppHref(locale)}
                  aria-label={whatsApp.label}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-primary/35 bg-primary/10 px-5 py-3 text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MessageCircle className="h-5 w-5" />
                  {whatsApp.short}
                </a>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <Button asChild className="w-full bg-foreground text-background rounded-full py-6 text-lg">
                    <Link href={localizedHref("/contact")} onClick={() => setIsMobileMenuOpen(false)}>
                      {labels.cta}
                      <ArrowUpRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
