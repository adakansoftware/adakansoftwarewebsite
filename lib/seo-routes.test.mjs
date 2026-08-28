import assert from "node:assert/strict"
import test from "node:test"

import { buildLlmsText, buildRobotsPolicy, buildSitemapEntries, publicRoutes } from "./public-routes.ts"

const baseUrl = "https://adakansoftware.com"

test("sitemap emits every public locale URL with reciprocal language alternates", () => {
  const entries = buildSitemapEntries(publicRoutes, baseUrl)

  assert.equal(entries.length, publicRoutes.length * 2)
  assert.deepEqual(entries[0], {
    url: "https://adakansoftware.com/",
    alternates: {
      languages: {
        "tr-TR": "https://adakansoftware.com/",
        "en-US": "https://adakansoftware.com/en",
        "x-default": "https://adakansoftware.com/",
      },
    },
    changeFrequency: "weekly",
    priority: 1,
  })
})

test("robots policy permits public crawling and prevents admin and API crawling", () => {
  assert.deepEqual(buildRobotsPolicy(baseUrl), {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
    sitemap: "https://adakansoftware.com/sitemap.xml",
    host: "https://adakansoftware.com",
  })
})

test("llms index includes canonical public marketing pages and omits legal pages", () => {
  const output = buildLlmsText({ name: "Adakan Software", location: "Istanbul, Turkey", baseUrl, routes: publicRoutes })

  assert.match(output, /\[services\]\(https:\/\/adakansoftware\.com\/services\)/)
  assert.doesNotMatch(output, /\/privacy\)/)
  assert.match(output, /English equivalents are available under \/en\./)
})
