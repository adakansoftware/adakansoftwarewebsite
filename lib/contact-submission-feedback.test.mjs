import assert from "node:assert/strict"
import test from "node:test"

import { getContactDeliveryState } from "./contact-submission-feedback.ts"

test("recognizes an accepted contact delivery response", () => {
  assert.equal(getContactDeliveryState({ ok: true, deliveryPending: false }), "accepted")
})

test("recognizes an accepted contact delivery that remains queued", () => {
  assert.equal(getContactDeliveryState({ ok: true, deliveryPending: true }), "pending")
})

test("treats an accepted delivery without a queue flag as accepted", () => {
  assert.equal(getContactDeliveryState({ ok: true }), "accepted")
})

test("rejects malformed contact delivery responses", () => {
  assert.equal(getContactDeliveryState({ ok: false }), null)
  assert.equal(getContactDeliveryState(null), null)
})

test("rejects list-shaped contact delivery responses", () => {
  assert.equal(getContactDeliveryState([]), null)
})
