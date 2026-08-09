import assert from "node:assert/strict"
import test from "node:test"

import {
  clearAdminLoginFailures,
  isAdminLoginRateLimited,
  recordAdminLoginFailure,
} from "./admin-login-rate-limit.ts"

test("limits the sixth failed login within ten minutes", async () => {
  const now = 1_000_000
  const ip = "203.0.113.10"

  for (let count = 0; count < 5; count += 1) {
    await recordAdminLoginFailure(ip, now + count)
  }

  assert.equal(await isAdminLoginRateLimited(ip, now + 5), true)
})

test("clears failed login attempts after a successful login", async () => {
  const now = 2_000_000
  const ip = "203.0.113.11"

  for (let count = 0; count < 5; count += 1) {
    await recordAdminLoginFailure(ip, now + count)
  }

  await clearAdminLoginFailures(ip)

  assert.equal(await isAdminLoginRateLimited(ip, now + 5), false)
})

test("expires failed login attempts after ten minutes", async () => {
  const now = 3_000_000
  const ip = "203.0.113.12"

  await recordAdminLoginFailure(ip, now)

  assert.equal(await isAdminLoginRateLimited(ip, now + 600_001), false)
})
