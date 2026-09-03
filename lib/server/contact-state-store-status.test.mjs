import assert from "node:assert/strict"
import test from "node:test"

import { getSafeContactStateError } from "./contact-state-status.ts"

test("does not expose a failed backend's raw error to an HTTP response", () => {
  assert.equal(
    getSafeContactStateError({
      available: false,
      error: "Redis authentication failed for redis://service-user:secret@redis.internal:6379",
    }),
    "Contact state is unavailable",
  )
})

test("does not create an error message while the contact state is available", () => {
  assert.equal(getSafeContactStateError({ available: true, error: null }), null)
})
