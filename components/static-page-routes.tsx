import { ArrowRight } from "lucide-react"

import { CTASection } from "@/components/cta-section"
import { PageHeader } from "@/components/page-header"
import type { Locale } from "@/lib/i18n"
import { careersPageContent, blogPageContent, legalPageContent } from "@/lib/static-page-content"
import { siteConfig } from "@/lib/site-config"

export function BlogPageContent({ locale }: { locale: Locale }) {
  const copy = blogPageContent[locale]
  const label = locale === "tr" ? "E-bülten" : "Newsletter"
  const bodyText =
    locale === "tr"
      ? "Tasarım, marka ve frontend geliştirme üzerine ara sıra pratik notlar paylaşıyoruz. Haberdar olmak için e-posta bırak."
      : "We occasionally share practical notes on design, brand strategy, and frontend development. Leave your email to stay updated."
  const buttonLabel = locale === "tr" ? "Kayıt Ol" : "Subscribe"
  const subject = encodeURIComponent(locale === "tr" ? "E-bülten kaydı" : "Newsletter signup")

  return (
    <>
      <PageHeader locale={locale} {...copy} />
      <section className="relative pb-32">
        <div className="section-shell max-w-2xl">
          <div className="rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md md:p-10">
            <span className="text-xs font-medium tracking-widest text-accent uppercase">{label}</span>
            <h2 className="mt-4 text-2xl font-bold">{bodyText}</h2>
            <a
              href={`mailto:${siteConfig.email}?subject=${subject}`}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              {buttonLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
      <CTASection locale={locale} />
    </>
  )
}

export function CareersPageContent({ locale }: { locale: Locale }) {
  const copy = careersPageContent[locale]
  const values =
    locale === "tr"
      ? [
          {
            icon: "⚡",
            title: "Hız değil, doğruluk",
            body: "Hızlı üretmekten çok doğru üretmeyi önemseriz. Kaliteyi fırsata feda etmeyiz.",
          },
          {
            icon: "🎯",
            title: "Odak",
            body: "Az müşteri, derin iş. Aynı anda çok şey değil, biri için en iyisini yapıyoruz.",
          },
          {
            icon: "🧩",
            title: "Tasarım + Kod",
            body: "İkisi ayrı değil bizim için. Tasarımcılar kod okur, geliştiriciler tasarımı sorgular.",
          },
        ]
      : [
          {
            icon: "⚡",
            title: "Right, not fast",
            body: "We care more about doing it correctly than quickly. Quality is not traded for speed.",
          },
          {
            icon: "🎯",
            title: "Focus",
            body: "Few clients, deep work. We do one thing at its best rather than many things at once.",
          },
          {
            icon: "🧩",
            title: "Design + Code",
            body: "Not separate disciplines here. Designers read code, developers question design decisions.",
          },
        ]
  const subject = encodeURIComponent(locale === "tr" ? "Portfolyo başvurusu" : "Portfolio application")

  return (
    <>
      <PageHeader locale={locale} {...copy} />
      <section className="relative pb-32">
        <div className="section-shell space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {values.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/50 bg-card/25 p-6 backdrop-blur-md">
                <span className="text-3xl" aria-hidden="true">
                  {item.icon}
                </span>
                <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md">
            <p className="text-sm font-medium tracking-widest text-accent uppercase">{locale === "tr" ? "Açık Pozisyonlar" : "Open Roles"}</p>
            <h2 className="mt-3 text-2xl font-bold">{locale === "tr" ? "Şu an aktif ilan yok" : "No active listings right now"}</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {locale === "tr"
                ? "Fakat güçlü bir portfolyoyla ulaşabilirsin. Tasarım, frontend ve marka stratejisi alanlarındaki çalışmaları her zaman görmek isteriz. Başvurular değerlendirilir, sana dönüş yaparız."
                : "But you can always reach out with a strong portfolio. We are always happy to see work in design, frontend, and brand strategy. Applications are reviewed and we follow up."}
            </p>
            <a
              href={`mailto:${siteConfig.email}?subject=${subject}`}
              className="group mt-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/5 px-6 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
            >
              {locale === "tr" ? "Portfolyonu gönder" : "Send your portfolio"}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>
      <CTASection locale={locale} />
    </>
  )
}

export function LegalPageContent({
  locale,
  type,
}: {
  locale: Locale
  type: "privacy" | "terms"
}) {
  const copy = legalPageContent[type][locale]

  return (
    <>
      <PageHeader locale={locale} {...copy} />
      <section className="relative pb-32">
        <div className="section-shell max-w-3xl space-y-6 text-muted-foreground">
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <CTASection locale={locale} />
    </>
  )
}
