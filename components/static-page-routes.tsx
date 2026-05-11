import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import type { Locale } from "@/lib/i18n"

const blogContent = {
  tr: {
    eyebrow: "Blog",
    title: "Dijital büyüme üzerine",
    gradientText: "kısa notlar",
    description: "Tasarım, marka ve frontend geliştirme tarafında iş hedeflerine bağlanan pratik notlar.",
    secondaryHref: "/services",
    secondaryLabel: "Hizmetleri Gör",
    badge: "Yakında",
    ctaHref: "/contact",
    ctaLabel: "Haberdar olmak için iletişime geç",
    posts: [
      "İyi bir landing page ilk 5 saniyede ne anlatmalı?",
      "Marka kimliğinde renk sistemini doğru kurmak",
      "Next.js projelerinde performans ve algılanan hız",
    ],
  },
  en: {
    eyebrow: "Blog",
    title: "Short notes",
    gradientText: "on digital growth",
    description: "Practical notes on design, brand, and frontend development tied to business goals.",
    primaryHref: "/en/contact",
    primaryLabel: "Contact Us",
    secondaryHref: "/en/services",
    secondaryLabel: "View Services",
    badge: "Soon",
    ctaHref: "/en/contact",
    ctaLabel: "Contact us to be notified",
    posts: [
      "What should a strong landing page communicate in the first 5 seconds?",
      "Building a practical color system for brand identity",
      "Performance and perceived speed in Next.js projects",
    ],
  },
} satisfies Record<Locale, {
  eyebrow: string
  title: string
  gradientText: string
  description: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref: string
  secondaryLabel: string
  badge: string
  ctaHref: string
  ctaLabel: string
  posts: string[]
}>

const careersContent = {
  tr: {
    eyebrow: "Kariyer",
    title: "İyi iş üretmeyi seven",
    gradientText: "insanlarla çalışırız",
    description:
      "Şu an aktif ilan paylaşmıyoruz; fakat tasarım, frontend ve marka stratejisi alanlarında güçlü portfolyoları her zaman görmek isteriz.",
    primaryHref: "mailto:merhaba@adakan.com.tr",
    primaryLabel: "Portfolyo Gönder",
    secondaryHref: "/about",
    secondaryLabel: "Bizi Tanı",
    sectionTitle: "Portfolyo paylaşımı",
    sectionDescription:
      "Kısa bir tanıtım, seçilmiş işleriniz ve hangi rolde değer katmak istediğiniz yeterli.",
  },
  en: {
    eyebrow: "Careers",
    title: "We work with people",
    gradientText: "who care about craft",
    description:
      "We are not sharing active openings right now, but we are always happy to see strong portfolios in design, frontend, and brand strategy.",
    primaryHref: "mailto:merhaba@adakan.com.tr",
    primaryLabel: "Send Portfolio",
    secondaryHref: "/en/about",
    secondaryLabel: "Meet Us",
    sectionTitle: "Portfolio submissions",
    sectionDescription:
      "A short introduction, selected work, and the role where you want to contribute are enough.",
  },
} satisfies Record<Locale, {
  eyebrow: string
  title: string
  gradientText: string
  description: string
  primaryHref: string
  primaryLabel: string
  secondaryHref: string
  secondaryLabel: string
  sectionTitle: string
  sectionDescription: string
}>

const legalContent = {
  privacy: {
    tr: {
      eyebrow: "Gizlilik",
      title: "Veri kullanımında",
      gradientText: "şeffaf yaklaşım",
      description: "Bu sayfa, web sitesi üzerinden paylaşılan iletişim bilgilerinin nasıl ele alındığını özetler.",
      primaryHref: "/contact",
      primaryLabel: "İletişime Geç",
      paragraphs: [
        "İletişim amacıyla paylaştığınız bilgiler yalnızca talebinize yanıt vermek ve proje görüşmesini yürütmek için kullanılır.",
        "Bilgileriniz üçüncü taraflarla satış veya reklam amacıyla paylaşılmaz. Resmi yükümlülükler dışında kişisel verileriniz korunur.",
        "Herhangi bir silme veya güncelleme talebi için merhaba@adakan.com.tr adresinden iletişime geçebilirsiniz.",
      ],
    },
    en: {
      eyebrow: "Privacy",
      title: "A transparent",
      gradientText: "data approach",
      description: "This page summarizes how contact information shared through the website is handled.",
      primaryHref: "/en/contact",
      primaryLabel: "Contact Us",
      paragraphs: [
        "Information you share for contact purposes is used only to respond to your request and conduct project communication.",
        "Your information is not shared with third parties for sales or advertising purposes. Personal data is protected except for legal obligations.",
        "For deletion or update requests, you can contact us at merhaba@adakan.com.tr.",
      ],
    },
  },
  terms: {
    tr: {
      eyebrow: "Kullanım Şartları",
      title: "Web sitesini",
      gradientText: "doğru kullanım",
      description: "Bu sayfa, Adakan Software web sitesinin genel kullanım şartlarını özetler.",
      primaryHref: "/contact",
      primaryLabel: "Soru Sor",
      paragraphs: [
        "Bu web sitesindeki metin, görsel ve marka öğeleri Adakan Software’e aittir veya tanıtım amacıyla kullanılır.",
        "Site içeriği izinsiz kopyalanamaz, çoğaltılamaz veya yanıltıcı şekilde kullanılamaz.",
        "Proje kapsamı, teklif ve teslim koşulları her müşteri için ayrıca yazılı olarak belirlenir.",
      ],
    },
    en: {
      eyebrow: "Terms",
      title: "Using the website",
      gradientText: "properly",
      description: "This page summarizes the general terms for using the Adakan Software website.",
      primaryHref: "/en/contact",
      primaryLabel: "Ask a Question",
      paragraphs: [
        "The text, visuals, and brand elements on this website belong to Adakan Software or are used for promotional purposes.",
        "Site content may not be copied, reproduced, or used in a misleading way without permission.",
        "Project scope, pricing, and delivery terms are defined separately in writing for each client.",
      ],
    },
  },
} as const

export function BlogPageContent({ locale }: { locale: Locale }) {
  const copy = blogContent[locale]

  return (
    <>
      <PageHeader locale={locale} {...copy} />
      <section className="relative pb-32">
        <div className="section-shell grid gap-6 md:grid-cols-3">
          {copy.posts.map((post) => (
            <Link
              key={post}
              href={copy.ctaHref}
              className="group rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md transition-colors hover:border-primary/50"
            >
              <span className="text-sm text-primary">{copy.badge}</span>
              <h2 className="mt-4 text-2xl font-bold">{post}</h2>
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground">
                {copy.ctaLabel}
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

export function CareersPageContent({ locale }: { locale: Locale }) {
  const copy = careersContent[locale]

  return (
    <>
      <PageHeader locale={locale} {...copy} />
      <section className="relative pb-32">
        <div className="section-shell rounded-2xl border border-border/50 bg-card/25 p-8 backdrop-blur-md">
          <h2 className="text-2xl font-bold">{copy.sectionTitle}</h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">{copy.sectionDescription}</p>
          <Link href="mailto:merhaba@adakan.com.tr" className="mt-8 inline-flex items-center gap-2 text-primary">
            merhaba@adakan.com.tr
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
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
  const copy = legalContent[type][locale]

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
    </>
  )
}
