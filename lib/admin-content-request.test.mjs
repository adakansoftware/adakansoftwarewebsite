/* global Request */

import assert from "node:assert/strict"
import test from "node:test"

import { getAdminContentRequestError, readBoundedJsonObject } from "./admin-content-request.ts"

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

test("accepts an admin content mutation at the 32 KiB size limit", () => {
  const request = new Request("https://adakansoftware.com/api/admin/content", {
    method: "POST",
    headers: { "content-type": "application/json", "content-length": "32768" },
  })

  assert.equal(getAdminContentRequestError(request, () => true), null)
})

test("accepts a JSON content type with a charset", () => {
  const request = new Request("https://adakansoftware.com/api/admin/content", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
  })

  assert.equal(getAdminContentRequestError(request, () => true), null)
})

test("rejects an admin content mutation with an invalid content length", () => {
  const request = new Request("https://adakansoftware.com/api/admin/content", {
    method: "POST",
    headers: { "content-type": "application/json", "content-length": "32kb" },
  })

  assert.equal(getAdminContentRequestError(request, () => true), 413)
})

test("rejects an admin content mutation without a JSON content type", () => {
  const request = new Request("https://adakansoftware.com/api/admin/content", { method: "POST" })

  assert.equal(getAdminContentRequestError(request, () => true), 400)
})

test("rejects an oversized JSON body even when Content-Length is absent", async () => {
  const request = new Request("https://adakansoftware.com/api/admin/content", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ value: "x".repeat(33 * 1024) }),
  })

  assert.deepEqual(await readBoundedJsonObject(request, 32 * 1024), { ok: false, status: 413 })
})

test("rejects malformed JSON and JSON arrays", async () => {
  const malformed = new Request("https://adakansoftware.com/api/admin/content", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  })
  const array = new Request("https://adakansoftware.com/api/admin/content", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "[]",
  })

  assert.deepEqual(await readBoundedJsonObject(malformed, 32 * 1024), { ok: false, status: 400 })
  assert.deepEqual(await readBoundedJsonObject(array, 32 * 1024), { ok: false, status: 400 })
})
