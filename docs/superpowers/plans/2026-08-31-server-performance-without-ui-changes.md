# Server Performance Without UI Changes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Avoid duplicate public content queries without changing UI or animations.

**Architecture:** Add a small shared cache-tag module, cache each public content read for 60 seconds with `unstable_cache`, invalidate the matching tag after content mutations, and parallelize independent reads on the projects route.

**Tech Stack:** Next.js 16 App Router, React 19, Neon, Node test runner, TypeScript.

## Global Constraints

- Do not change Framer Motion imports, animation behavior, timers, scroll handlers, pointer handlers, styling, copy, or routes.
- Preserve current admin content mutation behavior and route revalidation.
- Keep every task in a distinct commit.

---

### Task 1: Define cache-tag contract

**Files:**
- Create: `lib/content-cache.ts`
- Create: `lib/content-cache.test.mjs`

**Interfaces:**
- Produces: `getManagedContentCacheTag(kind: ContentKind): string`.

- [ ] **Step 1: Write the failing contract test**

```js
import assert from "node:assert/strict"
import test from "node:test"
import { getManagedContentCacheTag } from "./content-cache.ts"

test("returns stable, distinct cache tags for each managed content kind", () => {
  assert.equal(getManagedContentCacheTag("projects"), "managed-content:projects")
  assert.equal(getManagedContentCacheTag("logo_works"), "managed-content:logo_works")
})
```

- [ ] **Step 2: Verify the test fails because the module is absent**

Run: `node --experimental-strip-types --test lib/content-cache.test.mjs`

- [ ] **Step 3: Implement the mapping**

```ts
import type { ContentKind } from "@/lib/admin-content"

export function getManagedContentCacheTag(kind: ContentKind) {
  return `managed-content:${kind}`
}
```

- [ ] **Step 4: Verify the test passes and commit**

Run: `node --experimental-strip-types --test lib/content-cache.test.mjs`

```bash
git add lib/content-cache.ts lib/content-cache.test.mjs
git commit -m "perf: define managed content cache tags"
```

### Task 2: Cache public content reads and invalidate on write

**Files:**
- Modify: `lib/content.ts`
- Modify: `app/api/admin/content/route.ts`

**Interfaces:**
- Consumes: `getManagedContentCacheTag`.
- Produces: public project and logo-work reads cached for 60 seconds; writes invalidate the matching tag with the `max` cache profile.

- [ ] **Step 1: Add one `unstable_cache` wrapper per content kind**

```ts
const getCachedManagedProjects = unstable_cache(readManagedProjects, ["managed-projects"], {
  revalidate: 60,
  tags: [getManagedContentCacheTag("projects")],
})
```

- [ ] **Step 2: Replace each public export with its matching cached reader**

```ts
export function getManagedProjects(locale: Locale) {
  return getCachedManagedProjects(locale)
}
```

- [ ] **Step 3: Invalidate the matching tag after the existing path revalidation**

```ts
revalidateTag(getManagedContentCacheTag(kind), "max")
```

- [ ] **Step 4: Run targeted tests and commit**

Run: `npm run test:admin-security`

```bash
git add lib/content.ts app/api/admin/content/route.ts
git commit -m "perf: cache managed public content reads"
```

### Task 3: Parallelize projects-page reads

**Files:**
- Modify: `components/page-routes.tsx`

**Interfaces:**
- Produces: the same projects-page props after one parallel wait for projects and logo works.

- [ ] **Step 1: Replace the sequential awaits**

```ts
const [projects, logoWorks] = await Promise.all([getManagedProjects(locale), getManagedLogoWorks(locale)])
```

- [ ] **Step 2: Run lint and commit**

Run: `npm run lint`

```bash
git add components/page-routes.tsx
git commit -m "perf: parallelize projects page content reads"
```

### Task 4: Verify production behavior

**Files:**
- Inspect: changed files only

- [ ] **Step 1: Run full verification**

Run: `npm run test:seo; npm run lint; npm run build; npm run test:smoke`

- [ ] **Step 2: Confirm no forbidden UI files changed**

Run: `git diff HEAD~3 --name-only`
