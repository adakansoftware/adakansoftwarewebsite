import assert from "node:assert/strict"
import test from "node:test"

import { parseContactRequestUpdate } from "./admin-contact.ts"

test("accepts a valid contact request status update", () => {
  const result = parseContactRequestUpdate({
    id: "0f8fad5b-d9cb-469f-a165-70867728950e",
    status: "in_progress",
    adminNote: "Budget details requested.",
  })

  assert.deepEqual(result, {
    ok: true,
    data: {
      id: "0f8fad5b-d9cb-469f-a165-70867728950e",
      status: "in_progress",
      adminNote: "Budget details requested.",
    },
  })
})

test("rejects invalid contact request updates", () => {
  assert.deepEqual(parseContactRequestUpdate({ id: "not-a-uuid", status: "new", adminNote: "" }), {
    ok: false,
    message: "Geçersiz iletişim talebi.",
  })
  assert.deepEqual(parseContactRequestUpdate({ id: "0f8fad5b-d9cb-469f-a165-70867728950e", status: "deleted", adminNote: "" }), {
    ok: false,
    message: "Geçersiz iletişim talebi.",
  })
})
