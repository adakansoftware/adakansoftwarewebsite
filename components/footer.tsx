"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, Instagram, Linkedin, Twitter } from "lucide-react"

import { MagneticButton } from "@/components/magnetic-button"
import { withLocale, type Locale } from "@/lib/i18n"

const footerCopy = {
  tr: {
    homeLabel: "Adakan Software ana sayfa",
    description: "Büyümek isteyen markalar için stratejik web siteleri, marka kimlikleri ve dijital ürün arayüzleri üreten tasarım ve yazılım stüdyosu.",
    companyTitle: "Şirket",
    servicesTitle: "Hizmetler",
    rights: "Tüm hakları saklıdır.",
    privacy: "Gizlilik",
    terms: "Kullanım Şartları",
    location: "İstanbul, Türkiye",
    company: [
      { name: "Hakkımızda", href: "/about" },
      { name: "Kariyer", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "İletişim", href: "/contact" },
    ],
    services: [
      { name: "Web Tasarım", href: "/services#web-design" },
      { name: "Marka Kimliği", href: "/services#brand-identity" },
      { name: "UI/UX Tasarım", href: "/services#ui-ux" },
      { name: "Frontend Geliştirme", href: "/services#frontend" },
    ],
  },
  en: {
    homeLabel: "Adakan Software home",
    description: "A design and software studio creating strategic websites, brand identities, and digital product interfaces for ambitious brands.",
    companyTitle: "Company",
    servicesTitle: "Services",
    rights: "All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    location: "Istanbul, Turkey",
    company: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
    services: [
      { name: "Web Design", href: "/services#web-design" },
      { name: "Brand Identity", href: "/services#brand-identity" },
      { name: "UI/UX Design", href: "/services#ui-ux" },
      { name: "Frontend Development", href: "/services#frontend" },
    ],
  },
} satisfies Record<Locale, {
  homeLabel: string
  description: string
  companyTitle: string
  servicesTitle: string
  rights: string
  privacy: string
  terms: string
  location: string
  company: Array<{ name: string; href: string }>
  services: Array<{ name: string; href: string }>
}>

const socialLinks = [
  { icon: Github, href: "https://github.com/adakansoftware", label: "GitHub" },
  { icon: Twitter, href: "https://x.com/adakansoftware", label: "X" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/adakansoftware", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/adakansoftware", label: "Instagram" },
]

export function Footer({ locale }: { locale: Locale }) {
  const copy = footerCopy[locale]
  const localizedHref = (href: string) => withLocale(href, locale)

  return (
    <footer className="py-16 border-t border-border/30 relative">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <Link href={withLocale("/", locale)} className="mb-6 inline-flex items-center" aria-label={copy.homeLabel}>
              <Image
                src="/adakan-logo.png"
                alt="Adakan Software"
                width={180}
                height={118}
                className="h-16 w-auto drop-shadow-[0_0_24px_rgba(45,212,191,0.18)]"
              />
            </Link>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">{copy.description}</p>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <MagneticButton key={social.label} strength={0.2}>
                  <a
                    href={social.href}
                    className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-colors duration-300"
                    aria-label={social.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <social.icon className="w-4 h-4 text-muted-foreground" />
                  </a>
                </MagneticButton>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">{copy.companyTitle}</h4>
            <ul className="space-y-4">
              {copy.company.map((link) => (
                <li key={link.name}>
                  <Link href={localizedHref(link.href)} className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">{copy.servicesTitle}</h4>
            <ul className="space-y-4">
              {copy.services.map((link) => (
                <li key={link.name}>
                  <Link href={localizedHref(link.href)} className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group">
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Adakan Software. {copy.rights}
          </p>

          <div className="flex items-center gap-8">
            <Link href={localizedHref("/privacy")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {copy.privacy}
            </Link>
            <Link href={localizedHref("/terms")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {copy.terms}
            </Link>
            <span className="text-sm text-muted-foreground">{copy.location}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[12vw] font-bold text-border/[0.02] tracking-tighter leading-none whitespace-nowrap"
          >
            ADAKAN
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
