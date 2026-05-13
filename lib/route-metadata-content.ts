import type { Locale } from "@/lib/i18n"

export type RouteMetadataKey =
  | "home"
  | "about"
  | "approach"
  | "blog"
  | "careers"
  | "contact"
  | "privacy"
  | "projects"
  | "services"
  | "terms"
  | "testimonials"

type MetadataContent = {
  title: string
  description: string
  keywords?: string[]
}

export const routeMetadataContent: Record<RouteMetadataKey, Record<Locale, MetadataContent>> = {
  home: {
    tr: {
      title: "Premium Web Tasarımı ve Marka Ajansı",
      description:
        "Adakan Software; premium web tasarımı, marka kimliği, UI/UX ve dönüşüm odaklı dijital ürün deneyimleri sunan yaratıcı ajans.",
      keywords: ["premium web tasarımı", "marka ajansı", "ui ux tasarımı", "next.js ajansı"],
    },
    en: {
      title: "Premium Web Design and Brand Agency",
      description:
        "Adakan Software is a creative agency for premium websites, brand identity, UI/UX, and conversion-focused digital product experiences.",
      keywords: ["premium web design", "brand agency", "ui ux design", "next.js agency"],
    },
  },
  about: {
    tr: {
      title: "Hakkımızda",
      description: "Adakan Software tasarım, marka ve yazılımı aynı büyüme hedefinde birleştiren premium dijital stüdyodur.",
    },
    en: {
      title: "About",
      description: "Adakan Software is a premium digital studio connecting design, brand, and software around business growth.",
    },
  },
  approach: {
    tr: {
      title: "Yaklaşımımız",
      description: "Önce strateji, sonra zanaat. Adakan Software tasarım kararlarını marka, kullanıcı ve sürdürülebilirlik odağında kurar.",
    },
    en: {
      title: "Approach",
      description: "Strategy first, craft second. Adakan Software builds design decisions around brand, users, and long-term sustainability.",
    },
  },
  blog: {
    tr: {
      title: "Blog",
      description: "Tasarım, marka ve frontend geliştirme tarafında iş hedeflerine bağlanan pratik notlar.",
    },
    en: {
      title: "Blog",
      description: "Practical notes on design, brand, and frontend development tied to business goals.",
    },
  },
  careers: {
    tr: {
      title: "Kariyer",
      description: "Adakan Software ile tasarım, marka ve dijital ürün geliştirme odağında çalışma fırsatlarını keşfedin.",
    },
    en: {
      title: "Careers",
      description: "Explore opportunities to work with Adakan Software on design, brand, and digital product delivery.",
    },
  },
  contact: {
    tr: {
      title: "İletişim",
      description: "Yeni web sitesi, marka kimliği veya dijital ürün projeniz için Adakan Software ile iletişime geçin.",
    },
    en: {
      title: "Contact",
      description: "Get in touch with Adakan Software about your new website, brand identity, or digital product project.",
    },
  },
  privacy: {
    tr: {
      title: "Gizlilik",
      description: "Adakan Software web sitesinde paylaşılan iletişim bilgilerinin nasıl işlendiğine dair özet gizlilik bilgileri.",
    },
    en: {
      title: "Privacy",
      description: "Information about Adakan Software privacy practices, data use, and communication processes.",
    },
  },
  projects: {
    tr: {
      title: "Projeler",
      description: "Web tasarımı, marka kimliği ve dijital ürün geliştirme işlerinin seçili örnekleri.",
    },
    en: {
      title: "Projects",
      description: "Selected examples of web design, brand identity, and digital product development work.",
    },
  },
  services: {
    tr: {
      title: "Hizmetler",
      description: "Premium web tasarımı, marka kimliği, UI/UX ve frontend geliştirme hizmetleri.",
    },
    en: {
      title: "Services",
      description: "Premium web design, brand identity, UI/UX, and frontend development services.",
    },
  },
  terms: {
    tr: {
      title: "Kullanım Şartları",
      description: "Adakan Software web sitesinin genel kullanım şartlarına dair özet bilgiler.",
    },
    en: {
      title: "Terms",
      description: "Adakan Software website terms, service scope, and limitations of responsibility.",
    },
  },
  testimonials: {
    tr: {
      title: "Yorumlar",
      description: "Adakan Software ile çalışan ekiplerin deneyimleri, süreç kalitesi ve sonuç odaklı iş birlikleri.",
    },
    en: {
      title: "Testimonials",
      description: "Experiences, process quality, and outcome-focused collaboration from teams working with Adakan Software.",
    },
  },
}
