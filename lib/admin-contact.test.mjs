import assert from "node:assert/strict"
import test from "node:test"

import { contactRequestStatusLabel, filterContactRequests, parseContactRequestUpdate, toContactRequest } from "./admin-contact.ts"

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

test("normalizes database rows into the admin contact request response", () => {
  assert.deepEqual(toContactRequest({
    id: "0f8fad5b-d9cb-469f-a165-70867728950e",
    name: "Ada Example",
    email: "ada@example.com",
    phone: null,
    project: "A website redesign.",
    locale: "tr",
    status: "new",
    admin_note: "",
    created_at: new Date("2026-08-15T10:00:00.000Z"),
    updated_at: new Date("2026-08-15T10:00:00.000Z"),
  }), {
    id: "0f8fad5b-d9cb-469f-a165-70867728950e",
    name: "Ada Example",
    email: "ada@example.com",
    phone: null,
    project: "A website redesign.",
    locale: "tr",
    status: "new",
    adminNote: "",
    createdAt: "2026-08-15T10:00:00.000Z",
  })
})

test("filters admin contact requests by name, email, or project text", () => {
  const requests = [
    { id: "ada", name: "Ada Example", email: "ada@example.com", phone: null, project: "Website redesign", locale: "tr", status: "new", adminNote: "", createdAt: null },
    { id: "bora", name: "Bora Example", email: "bora@example.com", phone: null, project: "Brand strategy", locale: "en", status: "completed", adminNote: "", createdAt: null },
  ]

  assert.deepEqual(filterContactRequests(requests, "REDESIGN").map((request) => request.id), ["ada"])
  assert.deepEqual(filterContactRequests(requests, "bora@example.com").map((request) => request.id), ["bora"])
  assert.deepEqual(filterContactRequests(requests, "   ").map((request) => request.id), ["ada", "bora"])
})

test("uses localized labels for each admin contact request status", () => {
  assert.equal(contactRequestStatusLabel("new"), "Yeni")
  assert.equal(contactRequestStatusLabel("in_progress"), "İnceleniyor")
  assert.equal(contactRequestStatusLabel("completed"), "Tamamlandı")
})
