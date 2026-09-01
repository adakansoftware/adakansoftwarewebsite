# Streaming Request Body Limits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce admin request body limits while streaming so unbounded chunked payloads cannot be fully buffered in memory.

**Architecture:** A focused helper in the server layer reads request streams incrementally and returns text only when the accumulated byte count is within the configured limit. Existing admin request parsers delegate to it, preserving their validation and response contracts.

**Tech Stack:** Next.js 16 Route Handlers, TypeScript, Node test runner.

## Global Constraints

- Do not modify any UI files under `app/**/page.tsx`, `components/`, or CSS.
- Keep the existing 8 KiB login and 32 KiB content request limits.
- Preserve existing JSON validation and status codes.
- Use test-driven development for every production change.

---

### Task 1: Stream and enforce body limits

**Files:**
- Create: `lib/server/request-body.ts`
- Create: `lib/server/request-body.test.mjs`
- Modify: `lib/admin-session-request.ts`
- Modify: `lib/admin-content-request.ts`

**Interfaces:**
- Produces: `readRequestTextWithinLimit(request: Request, maxBytes: number): Promise<{ ok: true; text: string } | { ok: false; status: 413 }>`.
- Consumes: standard Request readable body streams.

- [ ] **Step 1: Write failing streaming-limit tests**

```js
test("stops reading an oversized chunked request before its final chunk", async () => {
  // A ReadableStream records every pull; a 5-byte limit must consume only
  // the first 3-byte chunk before the second chunk crosses the limit.
  assert.deepEqual(await readRequestTextWithinLimit(request, 5), { ok: false, status: 413 })
  assert.equal(pulls, 2)
})
```

- [ ] **Step 2: Run the test to verify RED**

Run: `node --experimental-strip-types --test lib/server/request-body.test.mjs`

Expected: FAIL because the streaming helper does not exist.

- [ ] **Step 3: Add the minimal streaming reader**

```ts
const reader = request.body?.getReader()
let total = 0
for (;;) {
  const { done, value } = await reader.read()
  if (done) break
  total += value.byteLength
  if (total > maxBytes) {
    await reader.cancel()
    return { ok: false, status: 413 }
  }
  chunks.push(value)
}
```

- [ ] **Step 4: Delegate both admin parsers to the helper**

Use the helper's text result before calling `JSON.parse`; map its oversize result to their existing `{ ok: false, status: 413 }` response.

- [ ] **Step 5: Run the focused tests to verify GREEN**

Run: `node --experimental-strip-types --test lib/server/request-body.test.mjs lib/admin-session-request.test.mjs lib/admin-content-request.test.mjs`

Expected: PASS with no failures.

- [ ] **Step 6: Run quality gates**

Run: `npm run lint`, `npm run build`, and `node --experimental-strip-types --test <all lib *.test.mjs files>`.

Expected: each exits with code 0.
