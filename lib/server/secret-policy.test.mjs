import assert from "node:assert/strict"
import test from "node:test"

import { hasMinimumSecretLength } from "./secret-policy.ts"

test("rejects a short secret for privileged production operations", () => {
  assert.equal(hasMinimumSecretLength("too-short"), false)
})

test("accepts a 32-character secret for privileged production operations", () => {
  assert.equal(hasMinimumSecretLength("12345678901234567890123456789012"), true)
})
