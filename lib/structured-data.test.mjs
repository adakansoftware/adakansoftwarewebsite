import assert from "node:assert/strict"
import test from "node:test"

import { createBreadcrumbSchema, createWebPageSchema } from "./structured-data.ts"

const serviceRoute = { path: "/services", metadataKey: "services" }
const content = {
  title: "Premium Web Design and Brand Agency",
  description: "Premium web design, brand identity, UI/UX, and frontend development services.",
}

test("web page schema uses absolute canonical data without fabricated rating signals", () => {
  const schema = createWebPageSchema({ route: serviceRoute, locale: "en", url: "https://adakansoftware.com/en/services", content })

  assert.equal(schema["@context"], "https://schema.org")
  assert.equal(schema["@type"], "WebPage")
  assert.equal(schema.url, "https://adakansoftware.com/en/services")
  assert.equal(schema.name, content.title)
  assert.equal(schema.description, content.description)
  assert.equal("aggregateRating" in schema, false)
  assert.equal("review" in schema, false)
})

test("breadcrumbs use canonical localized URLs and retain the home-to-page order", () => {
  const schema = createBreadcrumbSchema({ route: serviceRoute, locale: "en", url: "https://adakansoftware.com/en/services", pageName: "Services" })

  assert.equal(schema["@type"], "BreadcrumbList")
  assert.deepEqual(schema.itemListElement, [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://adakansoftware.com/en" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://adakansoftware.com/en/services" },
  ])
})
