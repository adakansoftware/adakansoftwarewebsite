"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, Instagram, Linkedin, Twitter } from "lucide-react"

import { MagneticButton } from "@/components/magnetic-button"
import { withLocale, type Locale } from "@/lib/i18n"
import { footerContent, socialLinks } from "@/lib/shell-content"

const socialIcons = {
  GitHub: Github,
  X: Twitter,
  LinkedIn: Linkedin,
  Instagram: Instagram,
} as const

export function Footer({ locale }: { locale: Locale }) {
  const copy = footerContent[locale]
  const localizedHref = (href: string) => withLocale(href, locale)

  return (
    <footer className="relative border-t border-border/30 py-16">
      <div className="container mx-auto px-6">
        <div className="mb-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link
              href={withLocale("/", locale)}
              className="mb-6 inline-flex items-center"
              aria-label={locale === "tr" ? "Adakan Software ana sayfa" : "Adakan Software home"}
            >
              <Image
                src="/adakan-logo.png"
                alt="Adakan Software"
                width={180}
                height={118}
                className="h-16 w-auto drop-shadow-[0_0_24px_rgba(45,212,191,0.18)]"
              />
            </Link>
            <p className="mb-8 max-w-sm leading-relaxed text-muted-foreground">{copy.description}</p>

            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = socialIcons[social.label]

                return (
                  <MagneticButton key={social.label} strength={0.2}>
                    <a
                      href={social.href}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 transition-colors duration-300 hover:border-primary/50 hover:bg-primary/5"
                      aria-label={social.label}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </a>
                  </MagneticButton>
                )
              })}
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-7">
            <h4 className="mb-6 text-sm font-semibold tracking-wider text-foreground uppercase">{copy.companyTitle}</h4>
            <ul className="space-y-4">
              {copy.company.map((link) => (
                <li key={link.name}>
                  <Link href={localizedHref(link.href)} className="group inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-6 text-sm font-semibold tracking-wider text-foreground uppercase">{copy.servicesTitle}</h4>
            <ul className="space-y-4">
              {copy.services.map((link) => (
                <li key={link.name}>
                  <Link href={localizedHref(link.href)} className="group inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-border/30 pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Adakan Software. {copy.rights}
          </p>

          <div className="flex items-center gap-8">
            <Link href={localizedHref("/privacy")} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {copy.privacy}
            </Link>
            <Link href={localizedHref("/terms")} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {copy.terms}
            </Link>
            <span className="text-sm text-muted-foreground">{locale === "tr" ? "İstanbul, Türkiye" : "Istanbul, Turkey"}</span>
          </div>
        </div>

        <div className="pointer-events-none absolute right-0 bottom-0 left-0 overflow-hidden select-none">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[12vw] leading-none font-bold tracking-tighter text-border/[0.02] whitespace-nowrap"
          >
            ADAKAN
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
