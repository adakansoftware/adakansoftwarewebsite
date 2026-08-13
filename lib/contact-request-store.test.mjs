import assert from "node:assert/strict"
import test from "node:test"

import { createContactRequestRecorder } from "./contact-request-record.ts"

test("writes each accepted contact request before it can be acknowledged", async () => {
  const calls = []
  const recordContactRequest = createContactRequestRecorder({
    query: async (statement, values) => { calls.push({ statement, values }); return [] },
  })

  await recordContactRequest({
    name: "Ada Example",
    email: "ada@example.com",
    phone: "+90 555 000 0000",
    project: "A strategic website redesign for a growing studio.",
    locale: "tr",
  })

  assert.deepEqual(calls, [{
    statement: "insert into contact_requests (name, email, phone, project, locale) values ($1, $2, $3, $4, $5)",
    values: ["Ada Example", "ada@example.com", "+90 555 000 0000", "A strategic website redesign for a growing studio.", "tr"],
  }])
})
