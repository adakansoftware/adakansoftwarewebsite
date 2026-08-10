import assert from "node:assert/strict"
import test from "node:test"

import {
  createAdminSession,
  verifyAdminSession,
} from "./admin-session.ts"

const secret = "test-admin-session-secret"
const email = "admin@example.com"

test("rejects an admin session after its signed expiry", () => {
  const session = createAdminSession(email, secret, 1_000)

  assert.equal(verifyAdminSession(session, email, secret, 1_001), false)
})

test("rejects a session whose expiry was modified", () => {
  const session = createAdminSession(email, secret, 10_000)
  const [encodedEmail, , signature] = session.split(".")
  const altered = `${encodedEmail}.20000.${signature}`

  assert.equal(verifyAdminSession(altered, email, secret, 5_000), false)
})

test("rejects an admin session signed with an empty secret", () => {
  const session = createAdminSession(email, "", 10_000)

  assert.equal(verifyAdminSession(session, email, "", 5_000), false)
})
