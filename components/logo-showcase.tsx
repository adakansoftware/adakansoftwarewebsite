import Image from "next/image"

import { getLogoWorks } from "@/lib/site-data"
import type { Locale } from "@/lib/i18n"

type LogoWork = { title: string; category: string; description: string; initials: string; logoImage?: string; color: string }

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
            <article key={work.title} className="overflow-hidden rounded-2xl border border-white/10 bg-background/35">
              <div
                className="relative aspect-[4/3] overflow-hidden border-b border-white/10"
                style={{ background: `linear-gradient(135deg, ${work.color}1f, transparent 52%, ${work.color}12)` }}
              >
                <div className="absolute inset-0 grid-pattern opacity-15" />
                <div className="absolute inset-5 grid place-items-center rounded-xl border border-white/10 bg-background/45 p-5 backdrop-blur-md">
                  {work.logoImage ? (
                    <Image
                      src={work.logoImage}
                      alt={`${work.title} logo`}
                      width={320}
                      height={180}
                      className={`h-auto max-h-[72%] w-[82%] object-contain ${
                        work.title === "Salihoğulları Hafriyat" ? "-translate-y-3" : ""
                      }`}
                    />
                  ) : (
                    <span className="font-aquire text-5xl" style={{ color: work.color }}>
                      {work.initials}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs font-medium tracking-widest text-accent uppercase">{work.category}</p>
                <h3 className="mt-2 text-xl font-bold text-foreground">{work.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
