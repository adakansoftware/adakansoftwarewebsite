/* global Request */

import assert from "node:assert/strict"
import test from "node:test"

import { getAdminContentRequestError } from "./admin-content-request.ts"

test("rejects a cross-origin admin content mutation", () => {
  const request = new Request("https://adakansoftware.com/api/admin/content", {
    method: "POST",
    headers: { origin: "https://attacker.example", "content-type": "application/json" },
  })

  assert.equal(getAdminContentRequestError(request, () => false), 403)
})

test("rejects an admin content mutation over 32 KiB", () => {
  const request = new Request("https://adakansoftware.com/api/admin/content", {
    method: "POST",
    headers: { "content-type": "application/json", "content-length": "32769" },
  })

  assert.equal(getAdminContentRequestError(request, () => true), 413)
})

test("rejects an admin content mutation without a JSON content type", () => {
  const request = new Request("https://adakansoftware.com/api/admin/content", { method: "POST" })

  assert.equal(getAdminContentRequestError(request, () => true), 400)
})
