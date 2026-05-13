import type { Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site-config"

export const blogPageContent = {
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
} as const satisfies Record<
  Locale,
  {
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
  }
>

export const careersPageContent = {
  tr: {
    eyebrow: "Kariyer",
    title: "İyi iş üretmeyi seven",
    gradientText: "insanlarla çalışırız",
    description:
      "Şu an aktif ilan paylaşmıyoruz; fakat tasarım, frontend ve marka stratejisi alanlarında güçlü portfolyoları her zaman görmek isteriz.",
    primaryHref: `mailto:${siteConfig.email}`,
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
    primaryHref: `mailto:${siteConfig.email}`,
    primaryLabel: "Send Portfolio",
    secondaryHref: "/en/about",
    secondaryLabel: "Meet Us",
    sectionTitle: "Portfolio submissions",
    sectionDescription:
      "A short introduction, selected work, and the role where you want to contribute are enough.",
  },
} as const satisfies Record<
  Locale,
  {
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
  }
>

export const legalPageContent = {
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
        `Herhangi bir silme veya güncelleme talebi için ${siteConfig.email} adresinden iletişime geçebilirsiniz.`,
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
        `For deletion or update requests, you can contact us at ${siteConfig.email}.`,
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

