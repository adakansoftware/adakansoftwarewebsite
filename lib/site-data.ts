import type { Locale } from "@/lib/i18n"
import { withLocale } from "@/lib/i18n"

export const servicesByLocale = {
  tr: [
    {
      title: "Web Tasarım",
      href: "/services#web-design",
      description: "Markanın değerini ilk ekranda hissettiren, hızlı, erişilebilir ve dönüşüm odaklı web siteleri tasarlarız.",
      tags: ["Kurumsal site", "Landing page", "E-ticaret"],
    },
    {
      title: "Marka Kimliği",
      href: "/services#brand-identity",
      description: "Logo, renk, tipografi ve görsel dilin tek bir sistem gibi çalıştığı güçlü marka kimlikleri kurarız.",
      tags: ["Logo", "Görsel sistem", "Marka rehberi"],
    },
    {
      title: "UI/UX Tasarım",
      href: "/services#ui-ux",
      description: "Karmaşık akışları sadeleştirir, kullanıcıların ürünü anlamasını ve tekrar kullanmasını kolaylaştırırız.",
      tags: ["SaaS", "Panel", "Mobil uygulama"],
    },
    {
      title: "Frontend Geliştirme",
      href: "/services#frontend",
      description: "Tasarımları performanslı, responsive ve sürdürülebilir Next.js arayüzlerine dönüştürürüz.",
      tags: ["Next.js", "Animasyon", "Performans"],
    },
  ],
  en: [
    {
      title: "Web Design",
      href: "/services#web-design",
      description: "We design fast, accessible, conversion-focused websites that communicate your value from the first screen.",
      tags: ["Corporate site", "Landing page", "E-commerce"],
    },
    {
      title: "Brand Identity",
      href: "/services#brand-identity",
      description: "We build strong identity systems where logo, color, typography, and visual language work as one.",
      tags: ["Logo", "Visual system", "Brand guide"],
    },
    {
      title: "UI/UX Design",
      href: "/services#ui-ux",
      description: "We simplify complex flows and make products easier to understand, trust, and use again.",
      tags: ["SaaS", "Dashboard", "Mobile app"],
    },
    {
      title: "Frontend Development",
      href: "/services#frontend",
      description: "We turn designs into performant, responsive, and maintainable Next.js interfaces.",
      tags: ["Next.js", "Animation", "Performance"],
    },
  ],
} satisfies Record<Locale, Array<{ title: string; href: string; description: string; tags: string[] }>>

export const projectsByLocale = {
  tr: [
    {
      title: "Nova Finans",
      href: "/projects#nova-finans",
      category: "Fintech web deneyimi",
      year: "2025",
      description: "Güven veren kurumsal dil, sade ürün anlatımı ve başvuru odaklı landing page sistemi.",
      color: "#14b8a6",
    },
    {
      title: "Vita Klinik",
      href: "/projects#vita-klinik",
      category: "Sağlık marka kimliği",
      year: "2025",
      description: "Hasta güvenini artıran yeni görsel kimlik, randevu akışı ve mobil öncelikli web sitesi.",
      color: "#84cc16",
    },
    {
      title: "Atlas Studio",
      href: "/projects#atlas-studio",
      category: "Yaratıcı portfolyo",
      year: "2024",
      description: "İşleri öne çıkaran hızlı portfolyo mimarisi, etkileşimli proje sayfaları ve rafine animasyon dili.",
      color: "#f59e0b",
    },
    {
      title: "Mira Market",
      href: "/projects#mira-market",
      category: "E-ticaret",
      year: "2024",
      description: "Kategori keşfini sadeleştiren, sepet terkini azaltmaya odaklanan modern alışveriş deneyimi.",
      color: "#22c55e",
    },
  ],
  en: [
    {
      title: "Nova Finance",
      href: "/projects#nova-finans",
      category: "Fintech web experience",
      year: "2025",
      description: "A trust-building corporate language, clear product messaging, and application-focused landing page system.",
      color: "#14b8a6",
    },
    {
      title: "Vita Clinic",
      href: "/projects#vita-klinik",
      category: "Healthcare brand identity",
      year: "2025",
      description: "A patient-focused visual identity, appointment flow, and mobile-first website experience.",
      color: "#84cc16",
    },
    {
      title: "Atlas Studio",
      href: "/projects#atlas-studio",
      category: "Creative portfolio",
      year: "2024",
      description: "A fast portfolio architecture, interactive case pages, and refined motion language.",
      color: "#f59e0b",
    },
    {
      title: "Mira Market",
      href: "/projects#mira-market",
      category: "E-commerce",
      year: "2024",
      description: "A modern shopping experience focused on clearer discovery and lower cart abandonment.",
      color: "#22c55e",
    },
  ],
} satisfies Record<Locale, Array<{ title: string; href: string; category: string; year: string; description: string; color: string }>>

export function getServices(locale: Locale) {
  return servicesByLocale[locale].map((service) => ({
    ...service,
    href: withLocale(service.href, locale),
  }))
}

export function getProjects(locale: Locale) {
  return projectsByLocale[locale].map((project) => ({
    ...project,
    href: withLocale(project.href, locale),
  }))
}

export const services = getServices("tr")
export const projects = getProjects("tr")
