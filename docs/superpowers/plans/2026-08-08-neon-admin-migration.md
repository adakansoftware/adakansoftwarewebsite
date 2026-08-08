# Neon Admin Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the remaining Supabase-backed administration workflow with Neon PostgreSQL and signed-cookie admin sessions.

**Architecture:** A server-only module validates content before route handlers issue parameterized Neon queries. Admin React pages consume JSON endpoints and never import a database client.

**Tech Stack:** Next.js 15, TypeScript, React 19, `@neondatabase/serverless`, Node test runner.

## Global Constraints

- Use only `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`.
- Allow only `projects` and `logo_works` content kinds.
- Retain static public-content fallback when Neon is unavailable or empty.
- Use image URLs; do not add a storage service.
- Require the signed admin cookie for every content request.

---

### Task 1: Validate content requests

**Files:** Create `lib/admin-content.ts` and `lib/admin-content.test.mjs`.

**Interfaces:** Produces `parseContentKind(value): "projects" | "logo_works" | null` and `parseContentPayload(kind, value)`.

- [ ] **Step 1: Write the failing test**

```js
import test from "node:test"
import assert from "node:assert/strict"
import { parseContentKind } from "./admin-content.ts"
test("accepts only content tables", () => {
  assert.equal(parseContentKind("projects"), "projects")
  assert.equal(parseContentKind("users"), null)
})
```

- [ ] **Step 2: Run the red test** — `node --test lib/admin-content.test.mjs`; expect failure because `parseContentKind` does not exist.

- [ ] **Step 3: Implement the smallest validator**

```ts
export type ContentKind = "projects" | "logo_works"
export function parseContentKind(value: unknown): ContentKind | null {
  return value === "projects" || value === "logo_works" ? value : null
}
```

Add payload validation for translated title/category/description; require `year` and `href` for projects and `initials` for logo works; accept empty or absolute HTTPS image URLs.

- [ ] **Step 4: Run the green test** — `node --test lib/admin-content.test.mjs`; expect PASS.

- [ ] **Step 5: Commit** — `git add lib/admin-content.ts lib/admin-content.test.mjs; git commit -m "feat: validate admin content payloads"`.

### Task 2: Add authenticated Neon CRUD routes

**Files:** Modify `app/api/admin/content/route.ts`, `app/api/admin/login/route.ts`, and `app/api/admin/session/route.ts`; create `app/api/admin/logout/route.ts`.

**Interfaces:** Consumes Task 1 validators, `isAdmin`, and `getNeonSql`; produces `GET|POST|PATCH|DELETE /api/admin/content`, plus session-aware login/logout/session routes.

- [ ] **Step 1: Write the failing regression test**

```js
test("rejects SQL injected table names", () => {
  assert.equal(parseContentKind("projects; drop table projects"), null)
})
```

- [ ] **Step 2: Run the red test** — `node --test lib/admin-content.test.mjs`; expect failure until Task 1 is implemented.

- [ ] **Step 3: Implement routes**

```ts
const kind = parseContentKind(new URL(request.url).searchParams.get("type"))
if (!kind) return NextResponse.json({ ok: false, message: "Geçersiz içerik türü." }, { status: 400 })
if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 })
```

Use tagged Neon queries with interpolated values. Insert, update, list, and delete only an allowlisted table; require UUID IDs for update/delete. Login sets the signed cookie and returns email, session returns email for a valid cookie, and logout clears it.

- [ ] **Step 4: Run the green test** — `node --test lib/admin-content.test.mjs`; expect PASS.

- [ ] **Step 5: Commit** — `git add app/api/admin lib/admin-content.ts lib/admin-content.test.mjs; git commit -m "feat: add authenticated Neon admin content API"`.

### Task 3: Move the admin browser UI to the API

**Files:** Modify `app/admin/login/page.tsx`, `app/admin/page.tsx`, `components/admin/admin-content-manager.tsx`; delete `lib/supabase/browser.ts`.

**Interfaces:** Consumes JSON from `/api/admin/login`, `/api/admin/session`, `/api/admin/logout`, and `/api/admin/content`.

- [ ] **Step 1: Write the failing structural test**

```js
import { readFileSync } from "node:fs"
test("admin manager has no Supabase client import", () => {
  assert.doesNotMatch(readFileSync("components/admin/admin-content-manager.tsx", "utf8"), /getSupabaseBrowserClient/)
})
```

- [ ] **Step 2: Run the red test** — `node --test lib/admin-content.test.mjs`; expect failure because Supabase is imported.

- [ ] **Step 3: Implement API client behavior** — use `fetch` to list/mutate content, post credentials to login, guard via session, and post to logout. Replace Storage upload state with `cover_image` / `logo_image` URL inputs.

- [ ] **Step 4: Run the green test** — `node --test lib/admin-content.test.mjs`; expect PASS.

- [ ] **Step 5: Commit** — `git add app/admin components/admin lib/admin-content.test.mjs; git rm lib/supabase/browser.ts; git commit -m "feat: connect admin UI to Neon API"`.

### Task 4: Remove Supabase and verify

**Files:** Create `lib/content.ts`; modify `app/page.tsx`, `app/[locale]/page.tsx`, `components/page-routes.tsx`, `.env.example`, `neon/schema.sql`, `scripts/verify-admin-content.mjs`, `package.json`, and `package-lock.json`; delete `lib/supabase/content.ts`, `supabase/schema.sql`, and `supabase/README.md`.

**Interfaces:** `lib/content.ts` exports `getManagedProjects(locale)` and `getManagedLogoWorks(locale)`.

- [ ] **Step 1: Write the failing cleanup test**

```js
test("package no longer declares Supabase", () => {
  assert.doesNotMatch(readFileSync("package.json", "utf8"), /@supabase\/supabase-js/)
})
```

- [ ] **Step 2: Run the red test** — `node --test lib/admin-content.test.mjs`; expect failure because Supabase is declared.

- [ ] **Step 3: Implement cleanup** — move Neon public loader to `lib/content.ts`, update three consumers, add required environment keys, index published content in Neon schema, update verification script, delete Supabase files, and run `npm uninstall @supabase/supabase-js`.

- [ ] **Step 4: Run verification** — `node --test lib/admin-content.test.mjs; npm run lint; npx tsc --noEmit; npm run build`; expect all commands to exit 0.

- [ ] **Step 5: Commit** — stage the modified files, remove obsolete Supabase files, then `git commit -m "chore: remove Supabase from admin stack"`.
