import type { Locale } from "@/lib/i18n"

export const siteConfig = {
  name: "Adakan Software",
  url: "https://adakansoftware.com",
  email: "merhaba@adakan.com.tr",
  location: {
    tr: "İstanbul, Türkiye",
    en: "Istanbul, Turkey",
  },
  defaultOgImage: "/adakan-logo.png",
} as const satisfies {
  name: string
  url: string
  email: string
  location: Record<Locale, string>
  defaultOgImage: string
}

export const rootMetadataCopy = {
  tr: {
    title: "Adakan Software | Premium Web Tasarımı ve Marka Ajansı",
    description:
      "Adakan Software; premium web tasarımı, logo, marka kimliği ve dönüşüm odaklı dijital ürün arayüzleri üreten futuristik yaratıcı ajans.",
    keywords: [
      "Adakan Software",
      "premium web tasarımı",
      "logo tasarımı",
      "marka kimliği",
      "web tasarım ajansı",
      "Next.js web sitesi",
      "UI UX tasarımı",
    ],
    openGraphDescription:
      "Premium web tasarımı, marka kimliği ve dönüşüm odaklı dijital ürün deneyimleri.",
    twitterDescription:
      "Futuristik web tasarımı, marka kimliği ve dijital ürün arayüzleri.",
  },
  en: {
    title: "Adakan Software | Premium Web Design and Brand Agency",
    description:
      "Adakan Software is a futuristic creative agency crafting premium websites, logos, brand identities, and conversion-focused digital product interfaces.",
    keywords: [
      "Adakan Software",
      "premium web design",
      "logo design",
      "brand identity",
      "web design agency",
      "Next.js website",
      "UI UX design",
    ],
    openGraphDescription:
      "Premium web design, brand identity, and conversion-focused digital product experiences.",
    twitterDescription:
      "Futuristic web design, brand identity, and digital product interfaces.",
  },
} satisfies Record<
  Locale,
  {
    title: string
    description: string
    keywords: string[]
    openGraphDescription: string
    twitterDescription: string
  }
>
