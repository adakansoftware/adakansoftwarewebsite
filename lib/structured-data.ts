type PublicRouteLike = {
  path: string
  metadataKey: string
}

type StructuredDataLocale = "tr" | "en"

type PageContent = {
  title: string
  description: string
}

export function createWebPageSchema({
  route: _route,
  locale,
  url,
  content,
}: {
  route: PublicRouteLike
  locale: StructuredDataLocale
  url: string
  content: PageContent
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: content.title,
    description: content.description,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    isPartOf: { "@id": `${new URL(url).origin}/#website` },
    about: { "@id": `${new URL(url).origin}/#organization` },
  }
}

export function createServiceSchema({ locale, url }: { locale: StructuredDataLocale; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: locale === "tr" ? "Web Tasarımı, Marka Kimliği ve UI/UX Hizmetleri" : "Web Design, Brand Identity and UI/UX Services",
    serviceType: locale === "tr" ? ["Web Tasarımı", "Marka Kimliği", "UI/UX Tasarımı", "Frontend Geliştirme"] : ["Web Design", "Brand Identity", "UI/UX Design", "Frontend Development"],
    provider: { "@id": `${new URL(url).origin}/#organization` },
    areaServed: ["TR", "GB", "US", "DE"],
    url,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
  }
}
