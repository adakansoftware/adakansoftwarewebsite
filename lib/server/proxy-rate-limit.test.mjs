import assert from "node:assert/strict"
import test from "node:test"

import { getProxyRateLimitDiagnostics, isProxyRateLimited } from "./proxy-rate-limit.ts"

test("reports the proxy limiter as best-effort per-instance protection", () => {
  const diagnostics = getProxyRateLimitDiagnostics()

  assert.equal(diagnostics.scope, "best-effort-per-instance")
  assert.equal(diagnostics.authoritative, false)
})

test("isolates proxy burst limits by API path", () => {
  const now = Date.now()
  const contactKey = `203.0.113.1:/api/contact:${now}`
  const healthKey = `203.0.113.1:/api/health:${now}`

  for (let index = 0; index < 30; index += 1) {
    assert.equal(isProxyRateLimited(contactKey, now), false)
  }

  assert.equal(isProxyRateLimited(contactKey, now), true)
  assert.equal(isProxyRateLimited(healthKey, now), false)
})
