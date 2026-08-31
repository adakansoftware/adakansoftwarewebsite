import assert from "node:assert/strict"
import test from "node:test"

/* global Request */

import { isOriginAllowed } from "./origin-policy.ts"

test("rejects mutation requests without an Origin header in production", () => {
  const request = new Request("https://adakansoftware.com/api/contact", { method: "POST" })
  assert.equal(isOriginAllowed(request, ["https://adakansoftware.com"], "production"), false)
})

test("accepts the configured same-origin request in production", () => {
  const request = new Request("https://adakansoftware.com/api/contact", {
    method: "POST",
    headers: { origin: "https://adakansoftware.com" },
  })
  assert.equal(isOriginAllowed(request, ["https://adakansoftware.com"], "production"), true)
})
