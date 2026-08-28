import assert from "node:assert/strict"
import test from "node:test"

import { getLocalizedPublicPath, getPublicUrl, publicRoutes } from "./public-routes.ts"

test("public routes produce unique canonical URLs for both supported locales", () => {
  const urls = publicRoutes.flatMap((route) => [getPublicUrl(route, "tr", "https://adakansoftware.com"), getPublicUrl(route, "en", "https://adakansoftware.com")])

  assert.equal(new Set(urls).size, urls.length)
  assert.equal(getLocalizedPublicPath(publicRoutes[0], "tr"), "/")
  assert.equal(getLocalizedPublicPath(publicRoutes[0], "en"), "/en")
  assert.deepEqual(
    publicRoutes.map((route) => route.path),
    ["/", "/about", "/approach", "/blog", "/careers", "/contact", "/logo", "/privacy", "/pricing", "/projects", "/services", "/terms", "/testimonials"],
  )
})
