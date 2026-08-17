import assert from "node:assert/strict"
import test from "node:test"

import { contactRequestContactHref, contactRequestStatusLabel, filterContactRequests, filterContactRequestsByStatus, formatContactRequestDate, hasActiveContactFilters, parseContactRequestUpdate, replaceContactRequest, toContactRequest } from "./admin-contact.ts"

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

test("trims admin notes before persisting a contact request update", () => {
  const result = parseContactRequestUpdate({ id: "0f8fad5b-d9cb-469f-a165-70867728950e", status: "new", adminNote: "  Follow up  " })
  assert.equal(result.ok && result.data.adminNote, "Follow up")
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

test("rejects a missing contact request update payload", () => {
  assert.deepEqual(parseContactRequestUpdate(null), { ok: false, message: "Geçersiz iletişim talebi." })
})

test("rejects contact request notes longer than the server limit", () => {
  assert.deepEqual(parseContactRequestUpdate({
    id: "0f8fad5b-d9cb-469f-a165-70867728950e",
    status: "new",
    adminNote: "a".repeat(2_001),
  }), { ok: false, message: "Geçersiz iletişim talebi." })
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

test("normalizes ISO timestamp strings from contact request rows", () => {
  const request = toContactRequest({
    id: "0f8fad5b-d9cb-469f-a165-70867728950e",
    name: "Ada Example",
    email: "ada@example.com",
    project: "Website redesign",
    locale: "tr",
    status: "new",
    created_at: "2026-08-15T10:00:00+03:00",
  })

  assert.equal(request?.createdAt, "2026-08-15T07:00:00.000Z")
})

test("defaults a missing admin note from a contact request row", () => {
  const request = toContactRequest({
    id: "0f8fad5b-d9cb-469f-a165-70867728950e",
    name: "Ada Example",
    email: "ada@example.com",
    project: "Website redesign",
    locale: "tr",
    status: "new",
    admin_note: null,
  })

  assert.equal(request?.adminNote, "")
})

test("drops database rows with unsupported contact request locales", () => {
  assert.equal(toContactRequest({ id: "id", name: "Ada", email: "ada@example.com", project: "Website", locale: "de", status: "new" }), null)
})

test("drops database rows with unknown contact request statuses", () => {
  assert.equal(toContactRequest({ id: "id", name: "Ada", email: "ada@example.com", project: "Website", locale: "tr", status: "deleted" }), null)
})

test("filters admin contact requests by name, email, or project text", () => {
  const requests = [
    { id: "ada", name: "Ada Example", email: "ada@example.com", phone: null, project: "Website redesign", locale: "tr", status: "new", adminNote: "", createdAt: null },
    { id: "bora", name: "Bora Example", email: "bora@example.com", phone: null, project: "Brand strategy", locale: "en", status: "completed", adminNote: "", createdAt: null },
  ]

  assert.deepEqual(filterContactRequests(requests, "REDESIGN").map((request) => request.id), ["ada"])
  assert.deepEqual(filterContactRequests(requests, "bora@example.com").map((request) => request.id), ["bora"])
  assert.deepEqual(filterContactRequests(requests, "   ").map((request) => request.id), ["ada", "bora"])
  assert.deepEqual(filterContactRequests(requests, "  ada  ").map((request) => request.id), ["ada"])
})

test("uses localized labels for each admin contact request status", () => {
  assert.equal(contactRequestStatusLabel("new"), "Yeni")
  assert.equal(contactRequestStatusLabel("in_progress"), "İnceleniyor")
  assert.equal(contactRequestStatusLabel("completed"), "Tamamlandı")
})

test("filters admin contact requests by status", () => {
  const requests = [
    { id: "new", name: "Ada", email: "ada@example.com", phone: null, project: "Website", locale: "tr", status: "new", adminNote: "", createdAt: null },
    { id: "done", name: "Bora", email: "bora@example.com", phone: null, project: "Brand", locale: "en", status: "completed", adminNote: "", createdAt: null },
  ]

  assert.deepEqual(filterContactRequestsByStatus(requests, "completed").map((request) => request.id), ["done"])
  assert.deepEqual(filterContactRequestsByStatus(requests, "all").map((request) => request.id), ["new", "done"])
})

test("formats a contact request timestamp for the admin inbox", () => {
  assert.equal(formatContactRequestDate("2026-08-15T10:30:00.000Z"), "15.08.2026 13:30")
  assert.equal(formatContactRequestDate("2026-08-15T10:30:00+00:00"), "15.08.2026 13:30")
  assert.equal(formatContactRequestDate(null), null)
  assert.equal(formatContactRequestDate("not-a-date"), null)
})

test("replaces a saved contact request without changing the inbox order", () => {
  const requests = [
    { id: "first", name: "Ada", email: "ada@example.com", phone: null, project: "Website", locale: "tr", status: "new", adminNote: "", createdAt: null },
    { id: "second", name: "Bora", email: "bora@example.com", phone: null, project: "Brand", locale: "en", status: "completed", adminNote: "", createdAt: null },
  ]

  assert.deepEqual(replaceContactRequest(requests, { ...requests[0], status: "in_progress" }).map((request) => request.status), ["in_progress", "completed"])
})

test("builds safe contact action links for an inbox request", () => {
  assert.equal(contactRequestContactHref("email", "ada@example.com"), "mailto:ada@example.com")
  assert.equal(contactRequestContactHref("email", "sales+test@example.com"), "mailto:sales+test@example.com")
  assert.equal(contactRequestContactHref("phone", "+90 555 000 00 00"), "tel:+905550000000")
  assert.equal(contactRequestContactHref("phone", null), null)
  assert.equal(contactRequestContactHref("phone", "( )"), null)
})

test("detects active contact inbox filters", () => {
  assert.equal(hasActiveContactFilters("", "all"), false)
  assert.equal(hasActiveContactFilters("Ada", "all"), true)
  assert.equal(hasActiveContactFilters("", "new"), true)
})
