# Admin Contact Inbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a secure admin dashboard and contact-request inbox while preserving the public website UI.

**Architecture:** Contact submissions are mirrored to a Neon `contact_requests` table after validation. Admin-only APIs list/update the records behind the existing session and request boundary; the admin client presents a dashboard and inbox next to the existing portfolio manager.

**Tech Stack:** Next.js App Router, React, TypeScript, Neon Postgres, Zod, Node test runner.

## Global Constraints

- Do not modify public-site components or CSS.
- Persist only valid contact submissions; a persistence failure must not change the contact endpoint response.
- Reuse `isAdmin`, `isAllowedOrigin`, and JSON request safeguards.

---

### Task 1: Add the contact request data boundary

**Files:**
- Modify: `neon/schema.sql`
- Create: `lib/admin-contact.ts`
- Test: `lib/admin-contact.test.mjs`

**Interfaces:**
- Produces `parseContactRequestUpdate(payload)` returning `{ ok: true, data: { id, status, adminNote } }` or `{ ok: false, message }`.

- [ ] Write a failing test that accepts an allowed status and rejects an invalid UUID or status.
- [ ] Run `node --experimental-strip-types --test lib/admin-contact.test.mjs` and confirm failure.
- [ ] Add the database table, index, and Zod-backed parser.
- [ ] Run the test and confirm success.
- [ ] Commit `feat: add contact request data model`.

### Task 2: Persist accepted submissions and expose admin routes

**Files:**
- Create: `lib/contact-request-store.ts`
- Modify: `app/api/contact/route.ts`
- Create: `app/api/admin/contact-requests/route.ts`
- Test: `lib/admin-contact-request.test.mjs`

**Interfaces:**
- Consumes `ContactSubmission` and `parseContactRequestUpdate`.
- Produces `recordContactRequest(submission)` and authenticated `GET`/`PATCH /api/admin/contact-requests`.

- [ ] Write failing request-boundary tests for cross-origin and invalid-content-type mutations.
- [ ] Run the test and confirm failure.
- [ ] Implement best-effort persistence and authenticated list/update handlers.
- [ ] Run the test and confirm success.
- [ ] Commit `feat: add admin contact request api`.

### Task 3: Build the dashboard and inbox

**Files:**
- Create: `components/admin/admin-contact-inbox.tsx`
- Modify: `components/admin/admin-content-manager.tsx`
- Test: `scripts/test-smoke-routes.mjs`

**Interfaces:**
- Consumes `GET/PATCH /api/admin/contact-requests`.
- Produces inbox rows with status updates and private notes.

- [ ] Add a failing smoke assertion that the contact-request API rejects unauthenticated access.
- [ ] Run `npm run test:smoke` and confirm failure if the endpoint is absent.
- [ ] Add dashboard counts, inbox navigation, status controls, and private-note editing without touching public components.
- [ ] Run smoke test, lint, and production build.
- [ ] Commit `feat: add admin contact inbox`.
