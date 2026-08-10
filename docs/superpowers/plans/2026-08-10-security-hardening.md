# Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the identified admin authentication and request-validation vulnerabilities without changing the website UI.

**Architecture:** Reuse the central HTTP policy helpers for origin and content-length validation. Add fail-closed session configuration checks and enforce the existing login limiter before credentials are parsed.

**Tech Stack:** Next.js 15 route handlers, TypeScript, Node.js test runner.

## Global Constraints

- Do not modify `components/`, page components, CSS, or user-visible UI behavior.
- Do not add dependencies.
- Preserve successful API response shapes.
- Make each completed security task its own git commit.

---

### Task 1: Enforce the admin login rate limit

**Files:**
- Modify: `app/api/admin/login/route.ts`
- Test: `lib/server/admin-login-rate-limit.test.mjs`

**Interfaces:** Consumes `isAdminLoginRateLimited(ip, now)` and returns `429` before credentials are parsed after five failures.

- [x] Write a failing route-level test proving a sixth login attempt is rejected.
- [x] Run the focused test and confirm it fails because the handler has no limiter pre-check.
- [x] Add the minimal limiter pre-check to the login route.
- [x] Re-run focused tests and commit `fix: enforce admin login rate limit`.

### Task 2: Fail closed for missing admin session configuration

**Files:**
- Modify: `lib/admin-auth.ts`, `lib/admin-session.ts`
- Test: `lib/admin-session.test.mjs`

**Interfaces:** Empty email or signing secret makes validation fail and prevents session creation.

- [x] Write a failing test that an empty secret cannot validate a signed session.
- [x] Run it, add the smallest guards, re-run focused tests, and commit `fix: require admin session secret`.

### Task 3: Validate state-changing admin content requests

**Files:**
- Modify: `app/api/admin/content/route.ts`
- Test: `lib/admin-content.test.mjs`

**Interfaces:** Reuses `isAllowedOrigin(request)` and `getContentLength(request)`; returns `403` for a supplied disallowed origin and `413` over 32 KiB.

- [x] Write failing tests for invalid origin and oversized request bodies.
- [x] Add the smallest shared-policy guards, re-run focused tests, and commit `fix: validate admin content requests`.

### Task 4: Verify the full hardening set

**Files:**
- Modify: `docs/superpowers/plans/2026-08-10-security-hardening.md`

- [x] Run `npm run test:admin-security`, `npm run lint`, `npm run audit:production`, and `npm run build`.
- [x] Mark verification results in this plan and commit `docs: record security hardening verification`.

Verification completed on 2026-08-10: 16 focused security tests passed, ESLint passed, `npm audit --omit=dev --audit-level=high` reported zero vulnerabilities, and the Next.js 16.3.0 production build completed successfully.
