# Proxy Rate-Limit Boundary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Make proxy rate-limit behavior explicit, testable, and non-authoritative while retaining durable endpoint-level protection.

**Architecture:** Proxy stays free of remote storage calls because it runs before routes and Next.js documents that shared globals are not reliable dependencies there. The in-memory limiter remains a short best-effort abuse brake; existing Redis-backed contact and admin-login controls remain authoritative in production.

**Tech Stack:** Next.js 16.3 Proxy, TypeScript, Redis-backed contact state store, Node.js test runner.

## Global Constraints

- Do not alter locale routing, pages, components, CSS, or public URLs.
- Do not use Proxy memory state for authorization or durable production enforcement.
- Preserve current API paths and Redis endpoint controls.
- Do not add a Redis call to proxy.ts.
- The implementation must have its own commit.

---

### Task 1: Unit-test proxy limiter semantics

**Files:**
- Modify: lib/server/proxy-rate-limit.ts
- Create: lib/server/proxy-rate-limit.test.mjs

**Interfaces:** getProxyRateLimitDiagnostics includes scope equal to best-effort-per-instance and authoritative equal to false. isProxyRateLimited remains synchronous and per-path.

- [ ] **Step 1: Write failing diagnostics and isolation tests**

    const diagnostics = getProxyRateLimitDiagnostics()
    assert.equal(diagnostics.scope, "best-effort-per-instance")
    assert.equal(diagnostics.authoritative, false)

    const now = Date.now()
    for (let index = 0; index < 30; index += 1) {
      assert.equal(isProxyRateLimited("203.0.113.1:/api/contact", now), false)
    }
    assert.equal(isProxyRateLimited("203.0.113.1:/api/contact", now), true)
    assert.equal(isProxyRateLimited("203.0.113.1:/api/health", now), false)

- [ ] **Step 2: Run the focused test**

Run: node --experimental-strip-types --test lib/server/proxy-rate-limit.test.mjs

Expected: FAIL because diagnostics scope fields are absent.

- [ ] **Step 3: Add explicit scope fields**

    export function getProxyRateLimitDiagnostics() {
      return {
        trackedKeys: requestTimestampsByKey.size,
        policy: getProxyRateLimitPolicy(),
        scope: "best-effort-per-instance",
        authoritative: false,
      }
    }

- [ ] **Step 4: Re-run the focused test**

Run: node --experimental-strip-types --test lib/server/proxy-rate-limit.test.mjs

Expected: PASS.

### Task 2: Verify proxy matching and burst response behavior

**Files:**
- Modify: proxy.ts
- Modify: scripts/test-smoke-routes.mjs

**Interfaces:** API requests retain 429, Retry-After, Cache-Control: no-store, and X-Proxy-Cache: bypass behavior. Locale forwarding remains unchanged.

- [ ] **Step 1: Add a burst-contract smoke assertion**

    const responses = await Promise.all(
      Array.from({ length: 31 }, () => request("/api/health", {
        headers: { "X-Forwarded-For": "203.0.113.77" },
      })),
    )
    const limited = responses.at(-1)
    assert(limited?.status === 429, "/api/health burst: expected 429")
    assert(limited?.headers.get("retry-after") === "10", "/api/health burst: expected Retry-After")
    assert(limited?.headers.get("cache-control") === "no-store", "/api/health burst: expected no-store")
    assert(limited?.headers.get("x-proxy-cache") === "bypass", "/api/health burst: expected bypass")

- [ ] **Step 2: Run the smoke test to establish baseline**

Run: npm run test:smoke

Expected: PASS or one precise Proxy contract mismatch.

- [ ] **Step 3: Make only the minimum correction when required**

    return withSecurityHeaders(
      NextResponse.json(
        { ok: false, error: "Too many requests" },
        {
          status: 429,
          headers: {
            "Cache-Control": "no-store",
            "Retry-After": String(Math.ceil(policy.windowMs / 1000)),
          },
        },
      ),
    )

Do not change locale handling or introduce external I/O.

- [ ] **Step 4: Re-run the smoke test**

Run: npm run test:smoke

Expected: PASS.

### Task 3: Record durable rate-limit ownership

**Files:**
- Modify: lib/server/admin-login-rate-limit.test.mjs
- Modify: lib/server/client-ip.test.mjs
- Modify: OPERATIONS.md

**Interfaces:** Production login protection uses shared state storage. Production client IP uses only x-vercel-forwarded-for. Cross-instance perimeter throttling belongs to Vercel Firewall/WAF or an equivalent edge control.

- [ ] **Step 1: Add a trusted-IP regression**

    const headers = new Headers({
      "x-forwarded-for": "198.51.100.8",
      "x-vercel-forwarded-for": "203.0.113.8",
    })
    assert.equal(getTrustedClientIp(headers, "production"), "203.0.113.8")

- [ ] **Step 2: Run focused IP and rate-limit tests**

Run: node --experimental-strip-types --test lib/server/admin-login-rate-limit.test.mjs lib/server/client-ip.test.mjs

Expected: PASS once all assertions are present.

- [ ] **Step 3: Add operational ownership guidance**

    ## API perimeter rate limiting

    proxy.ts provides an in-process burst brake only. Configure Vercel Firewall/WAF
    or an equivalent edge rule for cross-instance API rate limiting. Redis-backed
    route policies remain authoritative for contact submissions and failed admin logins.

- [ ] **Step 4: Re-run focused proxy checks**

Run: node --experimental-strip-types --test lib/server/proxy-rate-limit.test.mjs lib/server/admin-login-rate-limit.test.mjs lib/server/client-ip.test.mjs

Expected: PASS.

### Task 4: Verify and commit the Proxy-boundary change

**Files:**
- Modify: proxy.ts, lib/server/proxy-rate-limit.ts
- Create: lib/server/proxy-rate-limit.test.mjs
- Modify: lib/server/admin-login-rate-limit.test.mjs, lib/server/client-ip.test.mjs
- Modify: scripts/test-smoke-routes.mjs, OPERATIONS.md

- [ ] **Step 1: Run verification**

Run: npm run test:admin-security; npm run lint; npm run build; npm run test:smoke

Expected: every command exits 0.

- [ ] **Step 2: Confirm UI exclusion and commit**

    git diff --check
    git add proxy.ts lib/server/proxy-rate-limit.ts lib/server/proxy-rate-limit.test.mjs lib/server/admin-login-rate-limit.test.mjs lib/server/client-ip.test.mjs scripts/test-smoke-routes.mjs OPERATIONS.md
    git commit -m "fix: clarify proxy rate-limit boundary"
