# Admin Content Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let an authenticated Adakan administrator manage published projects and logo works through `/admin` without changing the public-facing UI or its animations.

**Architecture:** Supabase Auth owns the email/password session. Supabase Postgres stores bilingual content and public image paths; Storage stores uploaded images. Existing static arrays remain the fallback, while the existing public renderers receive the same mapped project and logo-work shapes from a server data layer.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Zod, `@supabase/supabase-js`, Supabase Auth/Postgres/Storage, Tailwind CSS.

## Global Constraints

- Do not change visitor-facing layout, animation behaviour, navigation, or footer content.
- Use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in browser code only.
- Keep `SUPABASE_SECRET_KEY` server-only and excluded from Git.
- Permit public reads only for published records; require a signed-in user for all writes.
- Preserve static `getProjects` and `getLogoWorks` data if Supabase is unavailable.

---

### Task 1: Add the Supabase boundary and schema

**Files:**
- Create: `lib/supabase/browser.ts`, `lib/supabase/server.ts`, `lib/supabase/content.ts`, `supabase/schema.sql`
- Modify: `package.json`, `lib/site-data.ts`
- Test: `scripts/verify-admin-content.mjs`

**Interfaces:**
- Produces `getManagedProjects(locale)` and `getManagedLogoWorks(locale)` with the existing public-card data shape.
- Produces `createServerSupabaseClient()` for server routes and actions.

- [ ] **Step 1: Write the failing test**

```js
assert.match(contentSource, /getManagedProjects/)
assert.match(contentSource, /getManagedLogoWorks/)
assert.match(schemaSource, /create table public\.projects/)
assert.match(schemaSource, /create table public\.logo_works/)
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node scripts/verify-admin-content.mjs`

- [ ] **Step 3: Implement the minimal data boundary**

```ts
export async function getManagedProjects(locale: Locale) {
  const rows = await readPublishedProjects()
  return rows.length ? rows.map((row) => mapProject(row, locale)) : getProjects(locale)
}
```

Create SQL tables with bilingual fields, `published`, `sort_order`, timestamps, public-read RLS policies, authenticated-write RLS policies, and a public `portfolio-assets` Storage bucket.

- [ ] **Step 4: Run the verification and lint**

Run: `node scripts/verify-admin-content.mjs && npm run lint`

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json lib/supabase lib/site-data.ts supabase/schema.sql scripts/verify-admin-content.mjs
git commit -m "feat: add Supabase content data layer"
```

### Task 2: Connect public pages to managed content

**Files:**
- Modify: `app/page.tsx`, `app/[locale]/page.tsx`, `components/page-routes.tsx`, `components/projects-section.tsx`, `components/logo-works-section.tsx`, `components/logo-showcase.tsx`
- Test: `scripts/verify-admin-content.mjs`

**Interfaces:**
- Consumes `getManagedProjects(locale)` and `getManagedLogoWorks(locale)`.
- Produces the same public HTML/card inputs as today.

- [ ] **Step 1: Extend the failing test**

```js
assert.match(projectsSectionSource, /projects:\s*Project\[\]/)
assert.match(logoSectionSource, /works:\s*LogoWork\[\]/)
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node scripts/verify-admin-content.mjs`

- [ ] **Step 3: Pass server-loaded arrays into existing public components**

Keep all existing classes and Framer Motion configuration; only replace the source of the arrays. Use static data if the Supabase client is not configured or a read fails.

- [ ] **Step 4: Run static, lint, and route verification**

Run: `node scripts/verify-admin-content.mjs && npm run lint && npm run test:smoke`

- [ ] **Step 5: Commit**

```bash
git add app components lib scripts/verify-admin-content.mjs
git commit -m "feat: load public portfolio content from Supabase"
```

### Task 3: Build authenticated admin entry and content CRUD

**Files:**
- Create: `app/admin/login/page.tsx`, `app/admin/page.tsx`, `app/admin/projects/[id]/page.tsx`, `app/admin/logos/[id]/page.tsx`, `app/admin/actions.ts`, `components/admin/content-form.tsx`, `components/admin/content-table.tsx`
- Modify: `middleware.ts`
- Test: `scripts/verify-admin-content.mjs`

**Interfaces:**
- Consumes server Supabase client and `ContentFormData` validated by Zod.
- Produces authenticated create, update, publish-toggle, and delete server actions for both content types.

- [ ] **Step 1: Extend the failing test**

```js
assert.match(adminActionSource, /requireAdmin/)
assert.match(adminActionSource, /safeParse/)
assert.match(middlewareSource, /pathname\.startsWith\("\/admin"\)/)
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node scripts/verify-admin-content.mjs`

- [ ] **Step 3: Implement login and protected CRUD screens**

Use the site’s dark backgrounds, `Button`, border, input, focus, and responsive spacing tokens. Redirect unauthenticated `/admin` requests to `/admin/login`; show inline Turkish validation or upload errors; do not render public `Navbar`, `Footer`, or animated background within admin pages.

- [ ] **Step 4: Run verification**

Run: `node scripts/verify-admin-content.mjs && npm run lint`

- [ ] **Step 5: Commit**

```bash
git add app/admin components/admin middleware.ts scripts/verify-admin-content.mjs
git commit -m "feat: add authenticated portfolio admin"
```

### Task 4: Add Storage uploads and final verification

**Files:**
- Modify: `app/admin/actions.ts`, `components/admin/content-form.tsx`, `supabase/schema.sql`
- Test: `scripts/verify-admin-content.mjs`

**Interfaces:**
- Upload action accepts an image `File`, creates a collision-safe `portfolio-assets/{type}/{uuid}-{name}` object, and stores its public URL in the corresponding content row.

- [ ] **Step 1: Extend the failing test**

```js
assert.match(adminActionSource, /storage\.from\("portfolio-assets"\)\.upload/)
assert.match(adminActionSource, /getPublicUrl/)
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node scripts/verify-admin-content.mjs`

- [ ] **Step 3: Implement upload validation and storage writes**

Accept only PNG, JPEG, WebP, or SVG files up to 5 MB; retain the existing image URL when no replacement is supplied; return an inline error when the bucket write fails.

- [ ] **Step 4: Run final verification**

Run: `node scripts/verify-admin-content.mjs && npm run lint && npm run test:smoke && npm run build`

- [ ] **Step 5: Commit**

```bash
git add app/admin components/admin supabase/schema.sql scripts/verify-admin-content.mjs
git commit -m "feat: add portfolio image uploads"
```

## Self-Review

- Spec coverage: Tasks 1–4 cover Auth, database, Storage, CRUD, publish state, fallback data, visitor UI preservation, validation, and verification.
- Placeholder scan: no deferred implementation steps or undefined interfaces remain.
- Type consistency: public loaders use the existing project/logo card shapes; CRUD uses one shared `ContentFormData` schema.
