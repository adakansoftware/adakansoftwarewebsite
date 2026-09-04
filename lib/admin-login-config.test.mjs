import assert from "node:assert/strict"
import test from "node:test"

import { hasAdminLoginConfiguration } from "./admin-login-config.ts"

test("rejects a login configuration with no administrator password", () => {
  assert.equal(
    hasAdminLoginConfiguration({
      email: "admin@example.com",
      password: "",
      sessionSecret: "session-signing-secret-with-32-chars",
    }),
    false,
  )
})

test("accepts a login configuration with all required credentials", () => {
  assert.equal(
    hasAdminLoginConfiguration({
      email: "admin@example.com",
      password: "password",
      sessionSecret: "session-signing-secret-with-32-chars",
    }),
    true,
  )
})

test("rejects a login configuration with a short session signing secret", () => {
  assert.equal(
    hasAdminLoginConfiguration({
      email: "admin@example.com",
      password: "password",
      sessionSecret: "too-short",
    }),
    false,
  )
})
