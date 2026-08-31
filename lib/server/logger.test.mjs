import assert from "node:assert/strict"
import test from "node:test"

import { createLogPayload } from "./logger.ts"

test("redacts secret-like fields from structured logs", () => {
  const payload = createLogPayload("error", "admin.login.rejected", {
    requestId: "req-1",
    authorization: "Bearer secret",
    password: "password",
    nested: { token: "secret-token", email: "person@example.com" },
  })

  assert.equal(payload.authorization, "[REDACTED]")
  assert.equal(payload.password, "[REDACTED]")
  assert.deepEqual(payload.nested, { token: "[REDACTED]", email: "[REDACTED]" })
})

test("adds a stable structured event envelope", () => {
  const payload = createLogPayload("info", "contact.accepted", { requestId: "req-2", route: "/api/contact" })
  assert.equal(payload.schemaVersion, 1)
  assert.equal(payload.level, "info")
  assert.equal(payload.event, "contact.accepted")
  assert.equal(payload.requestId, "req-2")
  assert.equal(payload.route, "/api/contact")
  assert.equal(typeof payload.timestamp, "string")
})
