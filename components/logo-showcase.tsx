import { getLogoWorks } from "@/lib/site-data"
import type { Locale } from "@/lib/i18n"
import { PortfolioLogoCard, type PortfolioLogoWork } from "@/components/portfolio-logo-card"

type LogoWork = PortfolioLogoWork

export function LogoShowcase({ locale, works: managedWorks }: { locale: Locale; works?: LogoWork[] }) {
  const works = (managedWorks ?? getLogoWorks(locale)).slice(0, 3)

  return (
    <section className="section-shell py-12 md:py-16">
      <div className="section-frame px-5 py-8 sm:px-7 lg:px-10 lg:py-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">{locale === "tr" ? "Seçilmiş çalışmalar" : "Selected work"}</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              {locale === "tr" ? "İşareti gerçek kullanımda gör" : "See the mark in use"}
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-right">
            {locale === "tr"
              ? "Her çalışma; sembol, wordmark ve dijital kullanım dengesiyle ele alındı."
              : "Each study balances symbol, wordmark, and digital use."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {works.map((work) => (
            <PortfolioLogoCard key={work.title} work={work} />
          ))}
        </div>
      </div>
    </section>
  )
}
