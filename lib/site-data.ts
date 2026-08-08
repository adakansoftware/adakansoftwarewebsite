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
      title: "Sallıhoğulları Hafriyat",
      href: "https://sallihogullaridemobyadakansoftware.vercel.app/",
      category: "Hafriyat kurumsal web sitesi",
      year: "2026",
      description: "Adana merkezli hafriyat ve iş makinesi hizmetleri için saha güveni, hizmet kapsamı ve teklif akışını netleştiren kurumsal web deneyimi.",
      color: "#f59e0b",
      coverImage: "/projects/sallihogullari-hafriyat-cover.png",
      logoImage: "/projects/salihogullari-hafriyat-logo.png",
    },
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
      title: "Sallıhoğulları Excavation",
      href: "https://sallihogullaridemobyadakansoftware.vercel.app/",
      category: "Construction services website",
      year: "2026",
      description: "A corporate web experience for an Adana-based excavation and machinery company, clarifying field trust, service scope, and quote flow.",
      color: "#f59e0b",
      coverImage: "/projects/sallihogullari-hafriyat-cover.png",
      logoImage: "/projects/salihogullari-hafriyat-logo.png",
    },
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
} satisfies Record<Locale, Array<{ title: string; href: string; category: string; year: string; description: string; color: string; coverImage?: string; logoImage?: string }>>

export const demoExamplesByLocale = {
  tr: [
    {
      title: "Sallıhoğulları Hafriyat Demo",
      href: "https://sallihogullaridemobyadakansoftware.vercel.app/",
      category: "Kurumsal demo",
      description: "Hafriyat ve iş makinesi hizmetleri için hazırlanmış canlı demo deneyimi.",
      coverImage: "/projects/sallihogullari-hafriyat-cover.png",
      color: "#f59e0b",
    },
    {
      title: "Premium Ajans Landing",
      href: "/projects#nova-finans",
      category: "Landing demo",
      description: "Güçlü hero, net CTA ve hızlı güven sinyalleriyle örnek satış odaklı sayfa akışı.",
      color: "#0066ff",
    },
    {
      title: "Marka Kimliği Sunumu",
      href: "/logo",
      category: "Logo demo",
      description: "Logo, renk, tipografi ve kullanım sistemini tek anlatıda gösteren örnek kimlik akışı.",
      color: "#14b8a6",
    },
  ],
  en: [
    {
      title: "Sallıhoğulları Excavation Demo",
      href: "https://sallihogullaridemobyadakansoftware.vercel.app/",
      category: "Corporate demo",
      description: "A live demo experience for excavation and machinery services.",
      coverImage: "/projects/sallihogullari-hafriyat-cover.png",
      color: "#f59e0b",
    },
    {
      title: "Premium Agency Landing",
      href: "/projects#nova-finans",
      category: "Landing demo",
      description: "A sample conversion-focused flow with a strong hero, clear CTA, and fast trust signals.",
      color: "#0066ff",
    },
    {
      title: "Brand Identity Presentation",
      href: "/logo",
      category: "Logo demo",
      description: "A sample identity flow that presents logo, color, typography, and usage as one system.",
      color: "#14b8a6",
    },
  ],
} satisfies Record<Locale, Array<{ title: string; href: string; category: string; description: string; color: string; coverImage?: string }>>

export const logoWorksByLocale = {
  tr: [
    {
      title: "Salihoğulları Hafriyat",
      category: "Minimal wordmark",
      description: "Teknoloji ve danışmanlık markaları için keskin, sade ve dijitalde güçlü duran logotype çalışması.",
      initials: "AX",
      logoImage: "/projects/salihogullari-hafriyat-logo.png",
      color: "#0066ff",
    },
    {
      title: "Adakan Hafriyat",
      category: "İnşaat ve hafriyat firması logosu",
      description: "Güven, sakinlik ve premium bakım hissini taşıyan yumuşak sembol ve tipografi sistemi.",
      initials: "LC",
      logoImage: "/projects/adakan-hafriyat-insaat-logo.png",
      color: "#14b8a6",
    },
    {
      title: "Adakan software",
      category: "Endüstriyel marka",
      description: "İnşaat ve saha operasyonları için güçlü, okunaklı ve kurumsal uygulamalara hazır logo seti.",
      initials: "OB",
      logoImage: "/projects/adakan-software-logo.png",
      color: "#f59e0b",
    },
    {
      title: "Mira Select",
      category: "E-ticaret logosu",
      description: "Modern satış kanalları, ambalaj ve sosyal medya kullanımına uyumlu esnek marka işareti.",
      initials: "MS",
      logoImage: "/projects/mira-market-logo.png",
      color: "#84cc16",
    },
  ],
  en: [
    {
      title: "Salihoğulları Hafriyat",
      category: "Minimal wordmark",
      description: "A sharp, simple, digitally strong logotype study for technology and consulting brands.",
      initials: "AX",
      logoImage: "/projects/salihogullari-hafriyat-logo.png",
      color: "#0066ff",
    },
    {
      title: "Adakan Hafriyat",
      category: "Construction identity",
      description: "A soft symbol and typography system built around trust, calmness, and premium care.",
      initials: "LC",
      logoImage: "/projects/adakan-hafriyat-insaat-logo.png",
      color: "#14b8a6",
    },
    {
      title: "Adakan software",
      category: "Industrial brand",
      description: "A strong, readable logo set ready for corporate use across construction and field operations.",
      initials: "OB",
      logoImage: "/projects/adakan-software-logo.png",
      color: "#f59e0b",
    },
    {
      title: "Mira Select",
      category: "E-commerce logo",
      description: "A flexible brand mark suited to modern sales channels, packaging, and social media usage.",
      initials: "MS",
      logoImage: "/projects/mira-market-logo.png",
      color: "#84cc16",
    },
  ],
} satisfies Record<
  Locale,
  Array<{ title: string; category: string; description: string; initials: string; logoImage?: string; color: string }>
>

function localizeHref(href: string, locale: Locale) {
  return href.startsWith("http://") || href.startsWith("https://") ? href : withLocale(href, locale)
}

export function getServices(locale: Locale) {
  return servicesByLocale[locale].map((service) => ({
    ...service,
    href: localizeHref(service.href, locale),
  }))
}

export function getProjects(locale: Locale) {
  return projectsByLocale[locale].map((project) => ({
    ...project,
    href: localizeHref(project.href, locale),
  }))
}

export function getDemoExamples(locale: Locale) {
  return demoExamplesByLocale[locale].map((demo) => ({
    ...demo,
    href: localizeHref(demo.href, locale),
  }))
}

export function getLogoWorks(locale: Locale) {
  return logoWorksByLocale[locale]
}

export const services = getServices("tr")
export const projects = getProjects("tr")
