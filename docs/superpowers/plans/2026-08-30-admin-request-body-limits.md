# Admin Request Body Limits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Enforce actual byte limits and strict JSON content types for every state-changing admin endpoint without affecting the UI.

**Architecture:** Extend the admin request-policy module with a bounded JSON reader. It first rejects invalid declared Content-Length, then reads once and validates UTF-8 byte size before parsing. Login, content, and contact-request mutations use this one reader.

**Tech Stack:** Next.js 16.3 Route Handlers, TypeScript, Node.js test runner.

## Global Constraints

- Do not modify components, page files, CSS, visible copy, or successful API bodies.
- Do not treat Content-Length as the only size control.
- Run origin validation before any body parsing.
- Limit login JSON to 8 KiB and content/contact-management JSON to 32 KiB.
- The implementation must have its own commit.

---

### Task 1: Build a bounded JSON reader

**Files:**
- Modify: lib/admin-content-request.ts
- Modify: lib/admin-content-request.test.mjs

**Interfaces:** Produce readBoundedJsonObject(request, maxBytes), returning either an object body or status 400 or 413.

- [ ] **Step 1: Write failing byte-limit tests**

    const request = new Request("https://adakansoftware.com/api/admin/content", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ value: "x".repeat(33 * 1024) }),
    })
    assert.deepEqual(
      await readBoundedJsonObject(request, 32 * 1024),
      { ok: false, status: 413 },
    )

Add two tests that malformed JSON and a JSON array return status 400.

- [ ] **Step 2: Run the focused test**

Run: node --experimental-strip-types --test lib/admin-content-request.test.mjs

Expected: FAIL because readBoundedJsonObject is missing.

- [ ] **Step 3: Implement actual byte counting and object parsing**

    export async function readBoundedJsonObject(request: Request, maxBytes: number) {
      const rawBody = await request.text()
      if (new TextEncoder().encode(rawBody).byteLength > maxBytes) {
        return { ok: false as const, status: 413 as const }
      }
      try {
        const body: unknown = JSON.parse(rawBody)
        return body && typeof body === "object" && !Array.isArray(body)
          ? { ok: true as const, body: body as Record<string, unknown> }
          : { ok: false as const, status: 400 as const }
      } catch {
        return { ok: false as const, status: 400 as const }
      }
    }

Keep the existing declared-length guard for known-large bodies.

- [ ] **Step 4: Re-run the focused test**

Run: node --experimental-strip-types --test lib/admin-content-request.test.mjs

Expected: PASS.

### Task 2: Use bounded parsing for content and contact-request mutations

**Files:**
- Modify: app/api/admin/content/route.ts
- Modify: app/api/admin/contact-requests/route.ts
- Test: lib/admin-content-request.test.mjs

**Interfaces:** Both routes use getAdminContentRequestError before readBoundedJsonObject(request, adminContentMaxBodyBytes). Invalid body stays 400; oversized parsed body is 413.

- [ ] **Step 1: Write a failing missing-Content-Length regression**

    const result = await readBoundedJsonObject(
      new Request("https://adakansoftware.com/api/admin/contact-requests", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ adminNote: "x".repeat(33 * 1024) }),
      }),
      adminContentMaxBodyBytes,
    )
    assert.deepEqual(result, { ok: false, status: 413 })

- [ ] **Step 2: Run the focused test**

Run: node --experimental-strip-types --test lib/admin-content-request.test.mjs

Expected: FAIL until the handler maps the bounded-reader failure.

- [ ] **Step 3: Replace the route-local request.json calls**

    const parsedBody = await readBoundedJsonObject(request, adminContentMaxBodyBytes)
    if (!parsedBody.ok) {
      return NextResponse.json(
        { ok: false, message: "Geçersiz istek gövdesi." },
        { status: parsedBody.status },
      )
    }
    const body = parsedBody.body

Do not return parser details to clients.

- [ ] **Step 4: Re-run the focused test**

Run: node --experimental-strip-types --test lib/admin-content-request.test.mjs

Expected: PASS.

### Task 3: Bound and validate login input

**Files:**
- Modify: lib/admin-session-request.ts
- Modify: lib/admin-session-request.test.mjs
- Modify: app/api/admin/login/route.ts

**Interfaces:** Produce readAdminLoginCredentials(request), returning string email/password fields or status 400 or 413. Wrong credentials still use the existing indistinguishable 401 response.

- [ ] **Step 1: Write a failing login-size test**

    const oversized = new Request("https://adakansoftware.com/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "x".repeat(9 * 1024) }),
    })
    assert.equal((await readAdminLoginCredentials(oversized)).status, 413)

- [ ] **Step 2: Run the focused test**

Run: node --experimental-strip-types --test lib/admin-session-request.test.mjs

Expected: FAIL because the reader is missing.

- [ ] **Step 3: Implement and invoke the 8 KiB reader after the limiter**

    const credentials = await readAdminLoginCredentials(request)
    if (!credentials.ok) {
      return NextResponse.json(
        { ok: false },
        { status: credentials.status, headers: { "Cache-Control": "no-store" } },
      )
    }

Validate string fields. A valid-shaped but mismatched pair remains in the current 401 branch.

- [ ] **Step 4: Re-run the focused test**

Run: node --experimental-strip-types --test lib/admin-session-request.test.mjs

Expected: PASS.

### Task 4: Verify and commit bounded parsing

**Files:**
- Modify: lib/admin-content-request.ts, lib/admin-content-request.test.mjs
- Modify: lib/admin-session-request.ts, lib/admin-session-request.test.mjs
- Modify: app/api/admin/content/route.ts, app/api/admin/contact-requests/route.ts, app/api/admin/login/route.ts

- [ ] **Step 1: Run verification**

Run: npm run test:admin-security; npm run lint; npm run build

Expected: every command exits 0.

- [ ] **Step 2: Confirm UI exclusion and commit**

    git diff --check
    git add lib/admin-content-request.ts lib/admin-content-request.test.mjs lib/admin-session-request.ts lib/admin-session-request.test.mjs app/api/admin/content/route.ts app/api/admin/contact-requests/route.ts app/api/admin/login/route.ts
    git commit -m "fix: bound admin request bodies"
