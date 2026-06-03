import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { withLocale, type Locale } from "@/lib/i18n"
import { getLogoWorks } from "@/lib/site-data"

export function LogoWorksSection({ locale = "tr" }: { locale?: Locale }) {
  const logoWorks = getLogoWorks(locale).slice(0, 3)

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-10" />
      <div className="section-shell">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium tracking-widest text-accent uppercase">{locale === "tr" ? "Logo Çalışmaları" : "Logo Works"}</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              {locale === "tr" ? "Marka işaretini" : "Shape the mark"}
              <br />
              <span className="text-gradient">{locale === "tr" ? "sistem gibi kur" : "as a system"}</span>
            </h2>
          </div>
          <Link href={withLocale("/logo", locale)} className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            {locale === "tr" ? "Logo sayfasını gör" : "View logo page"}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {logoWorks.map((work) => (
            <Link
              key={work.title}
              href={withLocale("/logo", locale)}
              className="group overflow-hidden rounded-2xl border border-border/50 bg-card/25 p-5 transition-colors hover:border-accent/45 premium-border"
            >
              <div
                className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl border border-white/10"
                style={{ background: `linear-gradient(135deg, ${work.color}24, transparent 52%, ${work.color}14)` }}
              >
                <div className="absolute inset-0 grid-pattern opacity-15" />
                <div className="absolute inset-6 flex items-center justify-center rounded-2xl border border-white/10 bg-background/35 backdrop-blur-md">
                  <span className="font-aquire text-[clamp(3rem,9vw,5rem)] leading-none transition-transform duration-300 group-hover:scale-105" style={{ color: work.color }}>
                    {work.initials}
                  </span>
                </div>
                <div className="absolute right-4 bottom-4 h-2 w-16 rounded-full transition-transform duration-300 group-hover:scale-x-110" style={{ backgroundColor: work.color }} />
              </div>
              <p className="text-xs font-medium tracking-widest text-accent uppercase">{work.category}</p>
              <h3 className="mt-3 text-xl font-bold">{work.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{work.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
