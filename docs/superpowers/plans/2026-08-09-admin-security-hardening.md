# Admin Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Secure admin and managed-content behavior without changing visitor or admin UI.

**Architecture:** Keep existing paths, client components, response bodies, and static fallback. Add small server-only modules for login attempts and content source state; validate data at the existing admin boundary.

**Tech Stack:** Next.js 15, TypeScript, Node 24 built-in test runner, Neon, Redis.

## Global Constraints

- No visual, layout, animation, navigation, or admin-control changes.
- Admin session max age is exactly 28,800 seconds.
- Project links allow only a non-protocol-relative site path or an absolute HTTPS URL.
- Managed content must retain its current static fallback.
- Only authorized health diagnostics may expose content source state.

---

### Task 1: Validate project links

**Files:**
- Modify: `lib/admin-content.ts:12-82`
- Modify: `lib/admin-content.test.mjs:7-45`

**Interfaces:**
- Produces `parseProjectHref(value: unknown): string | undefined`.
- `parseContentPayload("projects", value)` uses the parser and preserves `ParseResult`.

- [ ] **Step 1: Write the failing test**

```js
test("rejects unsafe project links", () => {
  const base = {
    title_tr: "Başlık", title_en: "Title", category_tr: "Kategori", category_en: "Category",
    description_tr: "Açıklama", description_en: "Description", year: "2026",
    color: "#0066ff", cover_image: null, published: true, archived: false, sort_order: 2,
  }
  assert.equal(parseContentPayload("projects", { ...base, href: "/projects/example" }).ok, true)
  assert.equal(parseContentPayload("projects", { ...base, href: "https://example.com" }).ok, true)
  assert.equal(parseContentPayload("projects", { ...base, href: "javascript:alert(1)" }).ok, false)
  assert.equal(parseContentPayload("projects", { ...base, href: "//evil.example" }).ok, false)
  assert.equal(parseContentPayload("projects", { ...base, href: "http://example.com" }).ok, false)
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test lib/admin-content.test.mjs`

Expected: FAIL because unsafe links are currently accepted.

- [ ] **Step 3: Implement the minimal parser**

```ts
export function parseProjectHref(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const href = value.trim()
  if (href.startsWith("/") && !href.startsWith("//")) return href
  try {
    return new URL(href).protocol === "https:" ? href : undefined
  } catch {
    return undefined
  }
}
```

Replace the current truthiness-only project `href` check with this parser and preserve the current Turkish 400 validation error.

- [ ] **Step 4: Run focused verification**

Run: `node --experimental-strip-types --test lib/admin-content.test.mjs && npx tsc --noEmit`

Expected: tests pass and TypeScript exits 0.

- [ ] **Step 5: Commit**

```bash
git add lib/admin-content.ts lib/admin-content.test.mjs
git commit -m "fix: validate managed project links"
```

### Task 2: Bound sessions and failed logins

**Files:**
- Create: `lib/server/admin-login-rate-limit.ts`
- Create: `lib/server/admin-login-rate-limit.test.mjs`
- Modify: `app/api/admin/login/route.ts:1-12`
- Modify: `app/api/admin/logout/route.ts:1-10`

**Interfaces:**
- Produces `isAdminLoginRateLimited(ip: string, now: number): boolean`, `recordAdminLoginFailure(ip: string, now: number): void`, and `clearAdminLoginFailures(ip: string): void`.
- Login consumes those functions plus `getTrustedClientIp(request.headers)`.
- Existing `adminCookie()` and `cookieName` remain unchanged.

- [ ] **Step 1: Write the failing tests**

```js
test("limits the sixth failed login and clears after success", () => {
  const now = 1_000_000
  const ip = "203.0.113.10"
  for (let count = 0; count < 5; count += 1) recordAdminLoginFailure(ip, now + count)
  assert.equal(isAdminLoginRateLimited(ip, now + 5), true)
  clearAdminLoginFailures(ip)
  assert.equal(isAdminLoginRateLimited(ip, now + 5), false)
})

test("expires failed attempts after ten minutes", () => {
  const now = 1_000_000
  recordAdminLoginFailure("203.0.113.11", now)
  assert.equal(isAdminLoginRateLimited("203.0.113.11", now + 600_001), false)
})
```

Also assert the login source sets `maxAge: 8 * 60 * 60`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --experimental-strip-types --test lib/server/admin-login-rate-limit.test.mjs`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement the limiter and route integration**

```ts
const WINDOW_MS = 10 * 60_000
const MAX_FAILURES = 5
const attemptsByIp = new Map<string, number[]>()

export function isAdminLoginRateLimited(ip: string, now: number) {
  const attempts = (attemptsByIp.get(ip) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS)
  attemptsByIp.set(ip, attempts)
  return attempts.length >= MAX_FAILURES
}
```

Record malformed and invalid credential attempts, clear attempts on successful authentication, and return the existing generic 401 payload in all denied cases. Set login `maxAge: 8 * 60 * 60`; retain secure, HTTP-only, same-site cookie attributes on login and logout.

- [ ] **Step 4: Run focused verification**

Run: `node --experimental-strip-types --test lib/server/admin-login-rate-limit.test.mjs && npm run lint && npx tsc --noEmit`

Expected: all commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add lib/server/admin-login-rate-limit.ts lib/server/admin-login-rate-limit.test.mjs app/api/admin/login/route.ts app/api/admin/logout/route.ts
git commit -m "fix: harden admin login sessions"
```

### Task 3: Record managed-content fallback state

**Files:**
- Create: `lib/content-source-status.ts`
- Create: `lib/content-source-status.test.mjs`
- Modify: `lib/content.ts:1-15`
- Modify: `app/api/health/route.ts:45-113`

**Interfaces:**
- Produces `recordManagedContentSource(kind, state)` and `getManagedContentSourceStatus()`.
- `kind` is `"projects" | "logo_works"`; `state` is `"managed" | "fallback-empty" | "fallback-error"`.
- Authorized health diagnostics consume the aggregate source state only.

- [ ] **Step 1: Write the failing test**

```js
test("returns latest non-sensitive content source states", () => {
  recordManagedContentSource("projects", "managed")
  recordManagedContentSource("logo_works", "fallback-error")
  assert.deepEqual(getManagedContentSourceStatus(), {
    projects: "managed",
    logoWorks: "fallback-error",
  })
})
```

Add source assertions that `lib/content.ts` records `fallback-error` in catch branches and health nests `managedContent` only inside `includeDiagnostics`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test lib/content-source-status.test.mjs`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement status handling**

```ts
export type ManagedContentSourceState = "managed" | "fallback-empty" | "fallback-error"

const status: { projects: ManagedContentSourceState; logoWorks: ManagedContentSourceState } = {
  projects: "fallback-empty",
  logoWorks: "fallback-empty",
}
```

Record `managed` for non-empty query results, `fallback-empty` for empty rows or missing database configuration, and `fallback-error` on query errors. Log query errors server-side but never return error text to health clients. Preserve existing fallback values exactly.

- [ ] **Step 4: Run focused verification**

Run: `node --experimental-strip-types --test lib/content-source-status.test.mjs && npm run lint && npx tsc --noEmit`

Expected: all commands exit 0.

- [ ] **Step 5: Commit**

```bash
git add lib/content-source-status.ts lib/content-source-status.test.mjs lib/content.ts app/api/health/route.ts
git commit -m "feat: report managed content fallback status"
```

### Task 4: Add an aggregate test command and verify unchanged UI routes

**Files:**
- Modify: `package.json:5-14`
- Modify: `scripts/test-smoke-routes.mjs:1-260`

**Interfaces:**
- Produces `npm run test:admin-security` for all three focused Node tests.
- Existing `npm run test:smoke` retains every public HTML assertion.

- [ ] **Step 1: Add failing smoke assertions**

```js
const session = await request("/api/admin/session")
assert(session.status === 401, "/api/admin/session: expected 401 without cookie")

const content = await request("/api/admin/content?type=projects")
assert(content.status === 401, "/api/admin/content: expected 401 without cookie")
```

Add this script entry:

```json
"test:admin-security": "node --experimental-strip-types --test lib/admin-content.test.mjs lib/server/admin-login-rate-limit.test.mjs lib/content-source-status.test.mjs"
```

- [ ] **Step 2: Run integration verification**

Run: `npm run test:admin-security && npm run test:smoke`

Expected: focused tests and all existing public route assertions pass.

- [ ] **Step 3: Run final verification**

Run: `npm run lint && npx tsc --noEmit && npm run test:admin-security && npm run test:smoke && npm run build`

Expected: all commands exit 0; the build continues to generate existing public routes.

- [ ] **Step 4: Commit**

```bash
git add package.json scripts/test-smoke-routes.mjs
git commit -m "test: cover admin security behavior"
```

## Self-Review

- Spec coverage: Tasks 1–4 cover link validation, eight-hour sessions, login throttling, non-sensitive fallback diagnostics, tests, and final verification.
- Placeholder scan: no deferred or undefined work remains.
- Type consistency: each later task consumes functions and state literals defined in its own interface block.

