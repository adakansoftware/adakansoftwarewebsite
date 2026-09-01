/* global ReadableStream, Request, TextEncoder */

import assert from "node:assert/strict"
import test from "node:test"

import { readRequestTextWithinLimit } from "./request-body.ts"

test("rejects an oversized stream without pulling a later chunk", async () => {
  const encoder = new TextEncoder()
  let pulls = 0
  const body = new ReadableStream({
    pull(controller) {
      pulls += 1
      if (pulls === 1) {
        controller.enqueue(encoder.encode("1234"))
        return
      }
      if (pulls === 2) {
        controller.enqueue(encoder.encode("56789"))
        return
      }
      throw new Error("later chunk should not be pulled")
    },
  })

  const request = new Request("https://adakansoftware.com/api/test", {
    method: "POST",
    body,
    duplex: "half",
  })

  assert.deepEqual(await readRequestTextWithinLimit(request, 8), { ok: false, status: 413 })
  assert.equal(pulls, 2)
})

test("decodes a stream as UTF-8 when it stays within the limit", async () => {
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("héllo"))
      controller.close()
    },
  })
  const request = new Request("https://adakansoftware.com/api/test", {
    method: "POST",
    body,
    duplex: "half",
  })

  assert.deepEqual(await readRequestTextWithinLimit(request, 6), { ok: true, text: "héllo" })
})
