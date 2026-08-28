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
  route,
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

export function createBreadcrumbSchema({
  route,
  locale,
  url,
  pageName,
}: {
  route: PublicRouteLike
  locale: StructuredDataLocale
  url: string
  pageName: string
}) {
  const origin = new URL(url).origin
  const homeUrl = locale === "tr" ? origin : `${origin}/en`
  const homeName = locale === "tr" ? "Ana Sayfa" : "Home"
  const items = [{ "@type": "ListItem", position: 1, name: homeName, item: homeUrl }]

  if (route.path !== "/") {
    items.push({ "@type": "ListItem", position: 2, name: pageName, item: url })
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
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
