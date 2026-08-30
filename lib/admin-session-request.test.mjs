/* global Request */

import assert from "node:assert/strict"
import test from "node:test"

import { getAdminSessionMutationRequestError, readAdminLoginCredentials } from "./admin-session-request.ts"

test("rejects a cross-origin admin login or logout request", () => {
  const request = new Request("https://adakansoftware.com/api/admin/logout", {
    method: "POST",
    headers: { origin: "https://attacker.example" },
  })

  assert.equal(getAdminSessionMutationRequestError(request, () => false), 403)
})

test("allows an admin login or logout request from an allowed origin", () => {
  const request = new Request("https://adakansoftware.com/api/admin/login", {
    method: "POST",
    headers: { origin: "https://adakansoftware.com" },
  })

  assert.equal(getAdminSessionMutationRequestError(request, () => true), null)
})

test("rejects login input over the 8 KiB request limit", async () => {
  const request = new Request("https://adakansoftware.com/api/admin/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "x".repeat(9 * 1024), password: "password" }),
  })

  assert.deepEqual(await readAdminLoginCredentials(request), { ok: false, status: 413 })
})
