import { Mail, MapPin, type LucideIcon } from "lucide-react"

import type { Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site-config"

type NavLink = { name: string; href: string }

export const navbarContent = {
  tr: {
    links: [
      { name: "Hizmetler", href: "/services" },
      { name: "Projeler", href: "/projects" },
      { name: "Yaklaşımımız", href: "/approach" },
      { name: "Yorumlar", href: "/testimonials" },
    ],
    cta: "Projeye Başla",
    homeLabel: "Adakan Software ana sayfa",
    openMenu: "Menüyü aç",
  },
  en: {
    links: [
      { name: "Services", href: "/services" },
      { name: "Projects", href: "/projects" },
      { name: "Approach", href: "/approach" },
      { name: "Testimonials", href: "/testimonials" },
    ],
    cta: "Start a Project",
    homeLabel: "Adakan Software home",
    openMenu: "Open menu",
  },
} satisfies Record<
  Locale,
  {
    links: NavLink[]
    cta: string
    homeLabel: string
    openMenu: string
  }
>

export const footerContent = {
  tr: {
    description:
      "Büyümek isteyen markalar için stratejik web siteleri, marka kimlikleri ve dijital ürün arayüzleri üreten tasarım ve yazılım stüdyosu.",
    companyTitle: "Şirket",
    servicesTitle: "Hizmetler",
    rights: "Tüm hakları saklıdır.",
    privacy: "Gizlilik",
    terms: "Kullanım Şartları",
    company: [
      { name: "Hakkımızda", href: "/about" },
      { name: "Kariyer", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "İletişim", href: "/contact" },
    ],
    services: [
      { name: "Web Tasarım", href: "/services#web-design" },
      { name: "Marka Kimliği", href: "/services#brand-identity" },
      { name: "UI/UX Tasarım", href: "/services#ui-ux" },
      { name: "Frontend Geliştirme", href: "/services#frontend" },
    ],
  },
  en: {
    description:
      "A design and software studio creating strategic websites, brand identities, and digital product interfaces for ambitious brands.",
    companyTitle: "Company",
    servicesTitle: "Services",
    rights: "All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    company: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
      { name: "Contact", href: "/contact" },
    ],
    services: [
      { name: "Web Design", href: "/services#web-design" },
      { name: "Brand Identity", href: "/services#brand-identity" },
      { name: "UI/UX Design", href: "/services#ui-ux" },
      { name: "Frontend Development", href: "/services#frontend" },
    ],
  },
} satisfies Record<
  Locale,
  {
    description: string
    companyTitle: string
    servicesTitle: string
    rights: string
    privacy: string
    terms: string
    company: NavLink[]
    services: NavLink[]
  }
>

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/adakansoftware" },
  { label: "X", href: "https://x.com/adakansoftware" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/adakansoftware" },
  { label: "Instagram", href: "https://www.instagram.com/adakansoftware" },
] as const

export const boundaryContent = {
  loading: {
    tr: "Sayfa hazırlanıyor",
    en: "Preparing page",
  },
  notFound: {
    tr: {
      title: "Aradığınız sayfa bulunamadı",
      description: "Route artık yok olabilir ya da bağlantı eksik olabilir. Akışı ana sayfadan tekrar kurabiliriz.",
      home: "Ana sayfaya dön",
      contact: "İletişime geç",
    },
    en: {
      title: "The page you are looking for could not be found",
      description: "The route may no longer exist or the link may be incomplete. We can rebuild the flow from the homepage.",
      home: "Return home",
      contact: "Contact us",
    },
  },
  error: {
    tr: {
      eyebrow: "Sistem hatası",
      title: "Beklenmeyen bir durum oluştu",
      description: "Deneyimi bozmadan toparlamak için hatayı izole ettik. Sayfayı yeniden denemek çoğu durumda yeterli olur.",
      retry: "Tekrar dene",
      home: "Ana sayfaya dön",
    },
    en: {
      eyebrow: "System error",
      title: "Something unexpected happened",
      description: "We isolated the issue to protect the experience. In most cases, trying the page again is enough.",
      retry: "Try again",
      home: "Return home",
    },
  },
} satisfies Record<string, unknown>

type ContactOption = {
  title: string
  value: string
  href: string
  icon: LucideIcon
}

export function getContactOptions(locale: Locale): ContactOption[] {
  return [
    {
      title: locale === "tr" ? "E-posta" : "Email",
      value: siteConfig.email,
      href:
        locale === "tr"
          ? "mailto:merhaba@adakan.com.tr?subject=Yeni%20proje%20g%C3%B6r%C3%BC%C5%9Fmesi"
          : "mailto:merhaba@adakan.com.tr?subject=New%20project%20inquiry",
      icon: Mail,
    },
    {
      title: locale === "tr" ? "Konum" : "Location",
      value: siteConfig.location[locale],
      href: locale === "tr" ? "/about" : "/en/about",
      icon: MapPin,
    },
  ]
}
