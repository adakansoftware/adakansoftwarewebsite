import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { FooterSocialLinks } from "@/components/footer-social-links"
import { FooterWordmark } from "@/components/footer-wordmark"
import { withLocale, type Locale } from "@/lib/i18n"
import { footerContent, socialLinks } from "@/lib/shell-content"
import { siteConfig } from "@/lib/site-config"

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

            <FooterSocialLinks links={socialLinks} />
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
            <span className="text-sm text-muted-foreground">{siteConfig.location[locale]}</span>
          </div>
        </div>
        <FooterWordmark />
      </div>
    </footer>
  )
}
