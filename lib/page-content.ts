import type { LucideIcon } from "lucide-react"

import type { Locale } from "@/lib/i18n"
import { getContactOptions } from "@/lib/shell-content"
import { siteConfig } from "@/lib/site-config"

type HeaderContent = {
  eyebrow: string
  title: string
  gradientText?: string
  description: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}

type AboutCard = {
  title: string
  description: string
}

type ServiceDetail = {
  id: string
  title: string
  outcome: string
  items: string[]
}

type ProjectCTA = {
  href: string
  label: string
}

type ContactOption = {
  title: string
  value: string
  href: string
  icon: LucideIcon
}

type ContactContent = {
  header: HeaderContent
  noteTitle: string
  noteDescription: string
  tags: string[]
  emailHref: string
  emailLabel: string
  messagingLabel: string
  options: ContactOption[]
}

type ServicesContent = {
  header: HeaderContent
  detailsTitle: string
  details: ServiceDetail[]
}

type ProjectsContent = {
  header: HeaderContent
  cta: ProjectCTA
}

type AboutContent = {
  header: HeaderContent
  cards: AboutCard[]
}

type TestimonialsContent = {
  header: HeaderContent
}

type ApproachContent = {
  header: HeaderContent
}

const aboutPageContent: Record<Locale, AboutContent> = {
  tr: {
    header: {
      eyebrow: "Hakkımızda",
      title: "Tasarım ve yazılımı",
      gradientText: "aynı masada topluyoruz",
      description:
        "Adakan Software; büyümek isteyen markalar için stratejik web siteleri, marka kimlikleri ve dijital ürün arayüzleri üreten bir tasarım ve yazılım stüdyosudur.",
      secondaryHref: "/projects",
      secondaryLabel: "Projeleri Gör",
    },
    cards: [
      {
        title: "Netlik",
        description: "Markanın ne anlattığını sadeleştirir, kullanıcıya ilk saniyede doğru sinyali veririz.",
      },
      {
        title: "Zanaat",
        description: "Tipografi, boşluk, hız ve hareket detaylarını marka algısını güçlendirmek için kullanırız.",
      },
      {
        title: "Süreklilik",
        description: "Teslim edilen işin yayından sonra da yönetilebilir ve geliştirilebilir kalmasını önemseriz.",
      },
    ],
  },
  en: {
    header: {
      eyebrow: "About",
      title: "We bring design",
      gradientText: "and software together",
      description:
        "Adakan Software is a design and software studio creating strategic websites, brand identities, and digital product interfaces for ambitious brands.",
      primaryHref: "/en/contact",
      primaryLabel: "Start a Project",
      secondaryHref: "/en/projects",
      secondaryLabel: "View Projects",
    },
    cards: [
      {
        title: "Clarity",
        description: "We simplify what the brand communicates and send the right signal in the first seconds.",
      },
      {
        title: "Craft",
        description: "Typography, spacing, speed, and motion are used to strengthen brand perception.",
      },
      {
        title: "Continuity",
        description: "We care that the delivered work remains manageable and extensible after launch.",
      },
    ],
  },
}

const approachPageContent: Record<Locale, ApproachContent> = {
  tr: {
    header: {
      eyebrow: "Yaklaşımımız",
      title: "Önce strateji,",
      gradientText: "sonra zanaat",
      description:
        "Güzel görünen ama hedefe bağlanmayan işlerden kaçınırız. Her kararın marka, kullanıcı ve teknik sürdürülebilirlik tarafında bir nedeni olmalı.",
      secondaryHref: "/services",
      secondaryLabel: "Hizmetleri Gör",
    },
  },
  en: {
    header: {
      eyebrow: "Approach",
      title: "Strategy first,",
      gradientText: "craft second",
      description:
        "We avoid work that looks good but does not connect to a goal. Every decision should have a reason for the brand, the user, and long-term maintainability.",
      primaryHref: "/en/contact",
      primaryLabel: "Start a Project",
      secondaryHref: "/en/services",
      secondaryLabel: "View Services",
    },
  },
}

const servicesPageContent: Record<Locale, ServicesContent> = {
  tr: {
    header: {
      eyebrow: "Hizmetler",
      title: "Markanın ihtiyacına göre",
      gradientText: "net çözümler",
      description:
        "Tek sayfalık bir vitrin yerine, her hizmet alanını ayrı hedef ve çıktı ile ele alıyoruz. Tasarım, metin ve geliştirme aynı büyüme amacına bağlanıyor.",
      secondaryHref: "/projects",
      secondaryLabel: "Projeleri İncele",
    },
    detailsTitle: "Hızlı yönlendirme",
    details: [
      {
        id: "web-design",
        title: "Web Tasarım",
        outcome: "İlk izlenimi güçlendiren, hızlı ve satış odaklı web deneyimleri.",
        items: ["Kurumsal web sitesi", "Landing page", "E-ticaret vitrinleri", "SEO uyumlu sayfa mimarisi"],
      },
      {
        id: "brand-identity",
        title: "Marka Kimliği",
        outcome: "Logo, renk, tipografi ve görsel dili tek bir sistemde toplarız.",
        items: ["Logo sistemi", "Renk ve tipografi", "Sosyal medya şablonları", "Marka kullanım rehberi"],
      },
      {
        id: "ui-ux",
        title: "UI/UX Tasarım",
        outcome: "Ürün akışlarını sadeleştirir, kullanıcı kararlarını kolaylaştırırız.",
        items: ["SaaS panel tasarımı", "Mobil uygulama arayüzleri", "Wireframe ve prototip", "Kullanıcı yolculuğu"],
      },
      {
        id: "frontend",
        title: "Frontend Geliştirme",
        outcome: "Tasarımları performanslı ve sürdürülebilir Next.js arayüzlerine dönüştürürüz.",
        items: ["Next.js geliştirme", "Responsive uygulama", "Animasyon sistemi", "Performans optimizasyonu"],
      },
    ],
  },
  en: {
    header: {
      eyebrow: "Services",
      title: "Clear solutions",
      gradientText: "for every need",
      description:
        "Instead of treating the site as a single showcase, we define each service area by its target, output, and business impact.",
      primaryHref: "/en/contact",
      primaryLabel: "Start a Project",
      secondaryHref: "/en/projects",
      secondaryLabel: "View Projects",
    },
    detailsTitle: "Quick navigation",
    details: [
      {
        id: "web-design",
        title: "Web Design",
        outcome: "Fast, conversion-focused web experiences that strengthen the first impression.",
        items: ["Corporate websites", "Landing pages", "E-commerce storefronts", "SEO-friendly page architecture"],
      },
      {
        id: "brand-identity",
        title: "Brand Identity",
        outcome: "We bring logo, color, typography, and visual language into one coherent system.",
        items: ["Logo system", "Color and typography", "Social media templates", "Brand usage guide"],
      },
      {
        id: "ui-ux",
        title: "UI/UX Design",
        outcome: "We simplify product flows and make user decisions easier.",
        items: ["SaaS dashboard design", "Mobile app interfaces", "Wireframes and prototypes", "User journeys"],
      },
      {
        id: "frontend",
        title: "Frontend Development",
        outcome: "We turn designs into performant and maintainable Next.js interfaces.",
        items: ["Next.js development", "Responsive implementation", "Motion systems", "Performance optimization"],
      },
    ],
  },
}

const projectsPageContent: Record<Locale, ProjectsContent> = {
  tr: {
    header: {
      eyebrow: "Projeler",
      title: "Seçilmiş işler,",
      gradientText: "ölçülebilir etki",
      description:
        "Her proje; marka anlatısı, kullanıcı deneyimi ve teknik uygulamanın aynı hedefe bağlandığı bir çalışma alanı olarak ele alındı.",
      primaryHref: "/contact",
      primaryLabel: "Benzer Proje Başlat",
      secondaryHref: "/services",
      secondaryLabel: "Hizmetleri Gör",
    },
    cta: {
      href: "/contact",
      label: "Projeni konuşalım",
    },
  },
  en: {
    header: {
      eyebrow: "Projects",
      title: "Selected work,",
      gradientText: "measurable impact",
      description:
        "Each project connects brand storytelling, user experience, and technical execution around one clear objective.",
      primaryHref: "/en/contact",
      primaryLabel: "Start a Similar Project",
      secondaryHref: "/en/services",
      secondaryLabel: "View Services",
    },
    cta: {
      href: "/en/contact",
      label: "Let's discuss your project",
    },
  },
}

const contactPageContent: Record<Locale, ContactContent> = {
  tr: {
    header: {
      eyebrow: "İletişim",
      title: "Projeni",
      gradientText: "birlikte netleştirelim",
      description:
        "Yeni web siteniz, marka kimliğiniz veya dijital ürününüz için hedefleri, kapsamı ve ilk teslim planını birlikte çıkaralım.",
      primaryHref: `mailto:${siteConfig.email}?subject=Yeni%20proje%20g%C3%B6r%C3%BC%C5%9Fmesi`,
      primaryLabel: "E-posta Gönder",
      secondaryHref: "/services",
      secondaryLabel: "Hizmetleri Gör",
    },
    noteTitle: "Başlangıç için kısa not",
    noteDescription:
      "Mail atarken proje türünü, varsa mevcut web sitenizi, hedeflediğiniz teslim tarihini ve beklentinizi yazmanız yeterli.",
    tags: ["Web sitesi", "Marka kimliği", "UI/UX", "Frontend geliştirme"],
    emailHref: `mailto:${siteConfig.email}?subject=Yeni%20proje%20g%C3%B6r%C3%BC%C5%9Fmesi`,
    emailLabel: siteConfig.email,
    messagingLabel: "WhatsApp",
    options: getContactOptions("tr"),
  },
  en: {
    header: {
      eyebrow: "Contact",
      title: "Let's clarify",
      gradientText: "your project",
      description:
        "For your new website, brand identity, or digital product, let's define goals, scope, and the first delivery plan together.",
      primaryHref: `mailto:${siteConfig.email}?subject=New%20project%20inquiry`,
      primaryLabel: "Send Email",
      secondaryHref: "/en/services",
      secondaryLabel: "View Services",
    },
    noteTitle: "A short note is enough to start",
    noteDescription: "Include the project type, your current website if available, target timeline, and expectations.",
    tags: ["Website", "Brand identity", "UI/UX", "Frontend development"],
    emailHref: `mailto:${siteConfig.email}?subject=New%20project%20inquiry`,
    emailLabel: siteConfig.email,
    messagingLabel: "WhatsApp",
    options: getContactOptions("en"),
  },
}

const testimonialsPageContent: Record<Locale, TestimonialsContent> = {
  tr: {
    header: {
      eyebrow: "Yorumlar",
      title: "İş ortaklarımızdan",
      gradientText: "gerçek geri bildirimler",
      description:
        "Tasarımın kalitesi kadar sürecin netliği de önemli. İş ortaklarımızın öne çıkardığı şey; anlaşılır iletişim, doğru öncelik ve teslim sonrası kullanılabilirlik.",
      secondaryHref: "/projects",
      secondaryLabel: "Projeleri İncele",
    },
  },
  en: {
    header: {
      eyebrow: "Testimonials",
      title: "Real feedback",
      gradientText: "from partners",
      description:
        "The quality of the process matters as much as the quality of design. Our partners value clear communication, right priorities, and usable delivery.",
      primaryHref: "/en/contact",
      primaryLabel: "Start a Project",
      secondaryHref: "/en/projects",
      secondaryLabel: "View Projects",
    },
  },
}

export function getAboutPageContent(locale: Locale) {
  return aboutPageContent[locale]
}

export function getApproachPageContent(locale: Locale) {
  return approachPageContent[locale]
}

export function getServicesPageContent(locale: Locale) {
  return servicesPageContent[locale]
}

export function getProjectsPageContent(locale: Locale) {
  return projectsPageContent[locale]
}

export function getContactPageContent(locale: Locale) {
  return contactPageContent[locale]
}

export function getTestimonialsPageContent(locale: Locale) {
  return testimonialsPageContent[locale]
}
