# API Response Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Standardize non-cacheable, request-correlated HTTP responses for every admin API route, without changing the UI or successful response bodies.

**Architecture:** Add method-response helpers to lib/server/http.ts. The existing admin handlers use them for explicit OPTIONS and their existing GET, POST, PATCH, and DELETE paths.

**Tech Stack:** Next.js 16.3 Route Handlers, TypeScript, Node.js test runner.

## Global Constraints

- Do not modify components, page files, CSS, visible copy, or success-body schemas.
- Every admin response sends Cache-Control: no-store and X-Request-Id.
- Login and logout allow POST, OPTIONS; session allows GET, OPTIONS.
- Content allows GET, POST, PATCH, DELETE, OPTIONS; contact requests allows GET, PATCH, OPTIONS.
- The implementation must have its own commit.

---

### Task 1: Add reusable response helpers

**Files:**
- Modify: lib/server/http.ts
- Create: lib/server/http.test.mjs

**Interfaces:** Produce optionsResponse(requestId, allow) and methodNotAllowedResponse(requestId, allow).

- [ ] **Step 1: Write the failing helper test**

    const response = optionsResponse("request-1", "GET, OPTIONS")
    assert.equal(response.status, 204)
    assert.equal(response.headers.get("allow"), "GET, OPTIONS")
    assert.equal(response.headers.get("cache-control"), "no-store")
    assert.equal(response.headers.get("x-request-id"), "request-1")

- [ ] **Step 2: Run the focused test**

Run: node --experimental-strip-types --test lib/server/http.test.mjs

Expected: FAIL because the helper exports do not exist.

- [ ] **Step 3: Implement the minimal helpers**

    export function optionsResponse(requestId: string, allow: string) {
      return emptyResponse({ status: 204, requestId, headers: { Allow: allow } })
    }

    export function methodNotAllowedResponse(requestId: string, allow: string) {
      return jsonResponse(
        { ok: false, error: "Method not allowed" },
        { status: 405, requestId, headers: { Allow: allow } },
      )
    }

- [ ] **Step 4: Re-run the focused test**

Run: node --experimental-strip-types --test lib/server/http.test.mjs

Expected: PASS.

### Task 2: Apply the contract to session endpoints

**Files:**
- Modify: app/api/admin/login/route.ts
- Modify: app/api/admin/logout/route.ts
- Modify: app/api/admin/session/route.ts
- Modify: scripts/test-smoke-routes.mjs

**Interfaces:** Add OPTIONS to all three routes. Existing statuses and JSON fields do not change.

- [ ] **Step 1: Write failing smoke assertions**

    for (const [path, allow] of [
      ["/api/admin/login", "POST, OPTIONS"],
      ["/api/admin/logout", "POST, OPTIONS"],
      ["/api/admin/session", "GET, OPTIONS"],
    ]) {
      const response = await request(path, { method: "OPTIONS" })
      assert(response.status === 204, path + ": expected 204")
      assert(response.headers.get("allow") === allow, path + ": expected Allow")
      assert(response.headers.get("cache-control") === "no-store", path + ": expected no-store")
      assert(Boolean(response.headers.get("x-request-id")), path + ": expected request id")
    }

- [ ] **Step 2: Run the smoke test**

Run: npm run test:smoke

Expected: FAIL because these routes lack OPTIONS handlers.

- [ ] **Step 3: Add optionsResponse and jsonResponse calls**

    const ALLOW_HEADER_VALUE = "POST, OPTIONS"

    export async function OPTIONS(request: Request) {
      return optionsResponse(createRequestId(request), ALLOW_HEADER_VALUE)
    }

Replace direct NextResponse.json calls in this task’s routes with jsonResponse. Preserve their current status and body.

- [ ] **Step 4: Re-run the smoke test**

Run: npm run test:smoke

Expected: PASS.

### Task 3: Apply the contract to content-management endpoints

**Files:**
- Modify: app/api/admin/content/route.ts
- Modify: app/api/admin/contact-requests/route.ts
- Modify: scripts/test-smoke-routes.mjs

**Interfaces:** Content has an Allow header of GET, POST, PATCH, DELETE, OPTIONS. Contact requests has GET, PATCH, OPTIONS.

- [ ] **Step 1: Write failing OPTIONS smoke checks**

    const response = await request("/api/admin/content", { method: "OPTIONS" })
    assert(response.status === 204, "admin content: expected 204")
    assert(response.headers.get("allow") === "GET, POST, PATCH, DELETE, OPTIONS", "admin content: expected Allow")

- [ ] **Step 2: Run the smoke test**

Run: npm run test:smoke

Expected: FAIL because these routes lack OPTIONS handlers.

- [ ] **Step 3: Add request IDs and helpers to every handler**

    export async function OPTIONS(request: Request) {
      return optionsResponse(createRequestId(request), "GET, PATCH, OPTIONS")
    }

    return jsonResponse({ ok: false }, { status: 401, requestId })

Keep existing Turkish error text and HTTP status codes.

- [ ] **Step 4: Re-run the smoke test**

Run: npm run test:smoke

Expected: PASS.

### Task 4: Verify and commit the API contract

**Files:**
- Modify: lib/server/http.ts, lib/server/http.test.mjs
- Modify: app/api/admin/login/route.ts, app/api/admin/logout/route.ts, app/api/admin/session/route.ts
- Modify: app/api/admin/content/route.ts, app/api/admin/contact-requests/route.ts
- Modify: scripts/test-smoke-routes.mjs

- [ ] **Step 1: Run full verification**

Run: npm run test:admin-security; npm run lint; npm run build; npm run test:smoke

Expected: every command exits 0.

- [ ] **Step 2: Confirm UI exclusion**

Run: git diff --check && git diff --name-only --cached

Expected: no components, page files, or CSS are staged.

- [ ] **Step 3: Commit this implementation only**

    git add lib/server/http.ts lib/server/http.test.mjs app/api/admin/login/route.ts app/api/admin/logout/route.ts app/api/admin/session/route.ts app/api/admin/content/route.ts app/api/admin/contact-requests/route.ts scripts/test-smoke-routes.mjs
    git commit -m "fix: standardize admin API response contracts"
