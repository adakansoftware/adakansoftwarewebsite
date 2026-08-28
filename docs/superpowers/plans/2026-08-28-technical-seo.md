# Technical SEO Strengthening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen crawlability, canonical locale indexing, structured data, and SEO regression coverage without changing any UI.

**Architecture:** A typed public-route registry will become the source of truth for canonical pages. Sitemap and `llms.txt` derive from this registry; a server-only schema builder derives route-aware JSON-LD from it. Focused Node tests execute the pure builders and route handlers directly.

**Tech Stack:** Next.js 16 App Router, TypeScript, Node.js built-in test runner, Schema.org JSON-LD.

## Global Constraints

- Do not modify visual UI, page copy, styling, or customer-facing component layout.
- Maintain Turkish as the unprefixed default locale and English as `/en`.
- Emit no fabricated reviews, ratings, awards, street addresses, or commercial offers.
- Use one atomic production change per commit.
- Run each newly added test while red before production code, then again while green.

---

### Task 1: Centralize public SEO route data

**Files:**
- Create: `lib/public-routes.ts`
- Create: `lib/public-routes.test.mjs`
- Modify: `app/sitemap.ts`
- Modify: `app/llms.txt/route.ts`

**Interfaces:**
- Produces: `publicRoutes`, `getLocalizedPublicPath(route, locale)`, and `getPublicUrl(route, locale)`.
- Consumes: `Locale` from `lib/i18n.ts` and `siteConfig.url`.

- [ ] **Step 1: Write the failing route-registry test**

```js
test("every public route has unique localized canonical URLs", () => {
  const urls = publicRoutes.flatMap((route) => [getPublicUrl(route, "tr"), getPublicUrl(route, "en")])
  assert.equal(new Set(urls).size, urls.length)
  assert.equal(getLocalizedPublicPath(homeRoute, "tr"), "/")
  assert.equal(getLocalizedPublicPath(homeRoute, "en"), "/en")
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test lib/public-routes.test.mjs`

Expected: FAIL because `lib/public-routes.ts` does not exist.

- [ ] **Step 3: Implement the typed registry and route consumers**

```ts
export const publicRoutes = [{ path: "/", metadataKey: "home", changeFrequency: "weekly", priority: 1, llms: true }]

export function getLocalizedPublicPath(route: PublicRoute, locale: Locale) {
  return locale === "tr" ? route.path : route.path === "/" ? "/en" : `/en${route.path}`
}
```

Have sitemap derive both entries and complete alternates from `publicRoutes`; have `llms.txt` derive only `llms: true` Turkish canonical links.

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --experimental-strip-types --test lib/public-routes.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/public-routes.ts lib/public-routes.test.mjs app/sitemap.ts app/llms.txt/route.ts
git commit -m "feat: centralize public SEO routes"
```

### Task 2: Add truthful page-aware structured data

**Files:**
- Create: `lib/structured-data.ts`
- Create: `lib/structured-data.test.mjs`
- Modify: `components/json-ld.tsx`
- Modify: public page route modules only to render an invisible server schema component

**Interfaces:**
- Produces: `createOrganizationSchema(locale)`, `createWebsiteSchema()`, `createWebPageSchema(route, locale)`, and `createBreadcrumbSchema(route, locale)`.
- Consumes: `PublicRoute`, `siteConfig`, and route metadata content.

- [ ] **Step 1: Write failing schema-builder tests**

```js
test("a service page emits only absolute, truthful schema URLs", () => {
  const schema = createWebPageSchema(serviceRoute, "en")
  assert.equal(schema["@type"], "WebPage")
  assert.match(schema.url, /^https:\/\//)
  assert.equal("aggregateRating" in schema, false)
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test lib/structured-data.test.mjs`

Expected: FAIL because the schema builder does not exist.

- [ ] **Step 3: Implement server-only JSON-LD builders and renderers**

```ts
export function createBreadcrumbSchema(route: PublicRoute, locale: Locale) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [/* home and current route */] }
}
```

Keep `ProfessionalService` and `WebSite` root schemas. Add a `WebPage` plus `BreadcrumbList` only when a page maps to the registry. Use visible route title/description as the schema name/description.

- [ ] **Step 4: Run the schema tests to verify they pass**

Run: `node --experimental-strip-types --test lib/structured-data.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/structured-data.ts lib/structured-data.test.mjs components/json-ld.tsx app
git commit -m "feat: add page-aware structured data"
```

### Task 3: Lock down crawl/index outputs with tests

**Files:**
- Create: `lib/seo-routes.test.mjs`
- Modify: `app/robots.ts`
- Modify: `app/sitemap.ts`
- Modify: `app/llms.txt/route.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: the default exports of robots and sitemap, `GET` from `llms.txt`, and `publicRoutes`.
- Produces: `npm run test:seo`.

- [ ] **Step 1: Write failing crawl-output tests**

```js
test("sitemap includes every locale URL and exact language alternates", () => {
  const entries = sitemap()
  assert.equal(entries.length, publicRoutes.length * 2)
  assert.deepEqual(entries[0].alternates.languages, { "tr-TR": "https://adakansoftware.com/", "en-US": "https://adakansoftware.com/en", "x-default": "https://adakansoftware.com/" })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test lib/seo-routes.test.mjs`

Expected: FAIL until all consumers derive their results from the shared registry.

- [ ] **Step 3: Implement deterministic sitemap dates and test script**

Add a build-safe `lastModified` date shared by all sitemap rows, preserve the permissive crawler rule and API/admin blocks, and add `test:seo` to `package.json`.

- [ ] **Step 4: Run the SEO test suite to verify it passes**

Run: `npm run test:seo`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/seo-routes.test.mjs app/robots.ts app/sitemap.ts app/llms.txt/route.ts package.json
git commit -m "test: cover technical SEO outputs"
```

### Task 4: Full verification

**Files:**
- Modify: none unless a verification failure requires a scoped correction.

- [ ] **Step 1: Run static checks**

Run: `npm run lint && npm run test:seo && npm run build`

Expected: all commands exit 0.

- [ ] **Step 2: Run route smoke checks**

Run: `npm run test:smoke`

Expected: smoke route checks pass against the production build.

- [ ] **Step 3: Inspect final diff and commit history**

Run: `git status --short && git log --oneline -5`

Expected: no SEO work remains uncommitted and each production layer has its own commit.
