import type { Locale } from "@/lib/i18n"
import { siteConfig } from "@/lib/site-config"

export function JsonLd({ locale }: { locale: Locale }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    logo: `${siteConfig.url}/adakan-logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
    },
    image: `${siteConfig.url}/og`,
    description:
      locale === "tr"
        ? "Büyümek isteyen markalar için stratejik web siteleri, marka kimlikleri ve dijital ürün arayüzleri üreten tasarım ve yazılım stüdyosu."
        : "A design and software studio creating strategic websites, brand identities, and digital product interfaces for growing brands.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressCountry: "TR",
    },
    areaServed: ["TR", "GB", "US", "DE"],
    serviceType: ["Web Design", "Brand Identity", "UI/UX Design", "Frontend Development", "Logo Design"],
    priceRange: "$$",
    sameAs: [
      "https://www.linkedin.com/company/adakan-software/",
      "https://twitter.com/adakansoftware",
      "https://github.com/adakansoftware",
      "https://www.instagram.com/adakansoftware",
    ],
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    inLanguage: ["tr-TR", "en-US"],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  )
}
