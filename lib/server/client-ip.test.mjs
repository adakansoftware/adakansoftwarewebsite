import assert from "node:assert/strict"
import test from "node:test"

import { getTrustedClientIp } from "./client-ip.ts"

test("uses the first trusted Vercel address when multiple proxies are present", () => {
  assert.equal(getTrustedClientIp(new globalThis.Headers({ "x-vercel-forwarded-for": "203.0.113.7, 10.0.0.2" }), "production"), "203.0.113.7")
})

test("normalizes an IPv4 trusted address with a proxy port", () => {
  assert.equal(getTrustedClientIp(new globalThis.Headers({ "x-vercel-forwarded-for": "203.0.113.7:443" }), "production"), "203.0.113.7")
})

test("ignores client-controlled generic forwarding headers in production", () => {
  const headers = new globalThis.Headers({
    "x-forwarded-for": "198.51.100.8",
    "x-vercel-forwarded-for": "203.0.113.8",
  })

  assert.equal(getTrustedClientIp(headers, "production"), "203.0.113.8")
})
