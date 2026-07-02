/* global console, fetch, process */

import { createHmac } from "node:crypto"

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3101"

const checks = [
  { path: "/", status: 200, htmlLang: "tr", includes: ["Hizmetler", "data-mobile-menu"] },
  { path: "/about", status: 200, htmlLang: "tr", includes: ["Hakkımızda"] },
  { path: "/contact", status: 200, htmlLang: "tr", includes: ["WhatsApp", "data-mobile-menu"] },
  { path: "/privacy", status: 200, htmlLang: "tr", includes: ["Gizlilik"] },
  { path: "/terms", status: 200, htmlLang: "tr", includes: ["Kullanım"] },
  { path: "/en/about", status: 200, includes: ["About", "/en/services"] },
  { path: "/en/contact", status: 200, includes: ["WhatsApp", "Start a Project"] },
  { path: "/en/privacy", status: 200, includes: ["Privacy"] },
  { path: "/en/terms", status: 200, includes: ["Terms"] },
  { path: "/api/health", status: 200, includes: ['"ok":true', '"service":"adakansoftware-website"', '"pipeline"'] },
]

async function request(path, init = {}) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual", ...init })
  const text = response.status === 204 ? "" : await response.text()

  return {
    status: response.status,
    location: response.headers.get("location"),
    headers: response.headers,
    text,
  }
}

async function postJson(path, body, headers = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  })

  return {
    status: response.status,
    headers: response.headers,
    json: await response.json(),
  }
}

let clientIpCounter = 10

function withTestClientIp(headers = {}) {
  clientIpCounter += 1

  return {
    "X-Forwarded-For": `127.0.0.${clientIpCounter}`,
    "X-Real-Ip": `127.0.0.${clientIpCounter}`,
    ...headers,
  }
}

function createSignedAdminHeaders(path, headers = {}) {
  const timestamp = String(Date.now())
  const actor = headers["X-Admin-Actor"] ?? headers["x-admin-actor"] ?? "signed-smoke"
  const reason = headers["X-Replay-Reason"] ?? headers["x-replay-reason"] ?? ""
  const payload = `GET\n${path}\n${timestamp}\n${actor}\n${reason}`
  const signature = createHmac("sha256", "test-admin-signing-secret").update(payload).digest("hex")

  return {
    "X-Admin-Timestamp": timestamp,
    "X-Admin-Actor": actor,
    "X-Admin-Signature": signature,
    ...headers,
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

for (const check of checks) {
  const result = await request(check.path)

  assert(result.status === check.status, `${check.path}: expected status ${check.status}, received ${result.status}`)

  if (check.location) {
    assert(result.location === check.location, `${check.path}: expected redirect location ${check.location}, received ${result.location}`)
  }

  if (check.htmlLang) {
    const langMatch = result.text.match(/<html lang="([^"]+)"/)
    assert(langMatch?.[1] === check.htmlLang, `${check.path}: expected html lang ${check.htmlLang}`)
  }

  if (check.includes) {
    for (const fragment of check.includes) {
      assert(result.text.includes(fragment), `${check.path}: missing expected fragment "${fragment}"`)
    }
  }
}

const optionsContact = await request("/api/contact", { method: "OPTIONS" })
assert(optionsContact.status === 204, `/api/contact OPTIONS: expected 204, received ${optionsContact.status}`)
assert(optionsContact.headers.get("allow") === "POST, OPTIONS", `/api/contact OPTIONS: expected Allow header`)

const optionsReplay = await request("/api/contact/replay", { method: "OPTIONS" })
assert(optionsReplay.status === 204, `/api/contact/replay OPTIONS: expected 204, received ${optionsReplay.status}`)
assert(optionsReplay.headers.get("allow") === "GET, POST, OPTIONS", `/api/contact/replay OPTIONS: expected Allow header`)

const optionsReplayCron = await request("/api/contact/replay/cron", { method: "OPTIONS" })
assert(optionsReplayCron.status === 204, `/api/contact/replay/cron OPTIONS: expected 204, received ${optionsReplayCron.status}`)
assert(optionsReplayCron.headers.get("allow") === "POST, OPTIONS", `/api/contact/replay/cron OPTIONS: expected Allow header`)

const getContact = await request("/api/contact")
assert(getContact.status === 405, `/api/contact GET: expected 405, received ${getContact.status}`)

const optionsHealth = await request("/api/health", { method: "OPTIONS" })
assert(optionsHealth.status === 204, `/api/health OPTIONS: expected 204, received ${optionsHealth.status}`)
assert(optionsHealth.headers.get("allow") === "GET, HEAD, OPTIONS", `/api/health OPTIONS: expected Allow header`)

const headHealth = await request("/api/health", { method: "HEAD" })
assert(headHealth.status === 200, `/api/health HEAD: expected 200, received ${headHealth.status}`)
assert(Boolean(headHealth.headers.get("x-request-id")), "/api/health HEAD: expected x-request-id header")

const invalidContact = await postJson("/api/contact", { email: "bad@example.com" }, withTestClientIp())
assert(invalidContact.status === 400, `/api/contact invalid body: expected 400, received ${invalidContact.status}`)
assert(Boolean(invalidContact.headers.get("x-request-id")), "/api/contact invalid body: expected x-request-id header")

const invalidOrigin = await postJson(
  "/api/contact",
  {
    name: "Origin Test",
    email: "origin@example.com",
    project: "Origin validation should reject this request cleanly.",
  },
  withTestClientIp({ Origin: "https://evil.example" }),
)
assert(invalidOrigin.status === 403, `/api/contact invalid origin: expected 403, received ${invalidOrigin.status}`)

const idempotentPayload = {
  name: "Idempotent User",
  email: "idempotent@example.com",
  project: "This request verifies idempotent replay for the contact endpoint.",
}

const firstIdempotent = await postJson("/api/contact", idempotentPayload, {
  ...withTestClientIp(),
  "Idempotency-Key": "contact-idempotency-test",
})
assert(firstIdempotent.status === 200, `/api/contact idempotent first: expected 200, received ${firstIdempotent.status}`)
assert(firstIdempotent.json?.queued === true, "/api/contact idempotent first: expected queued=true")

const replayedIdempotent = await postJson("/api/contact", idempotentPayload, {
  ...withTestClientIp(),
  "Idempotency-Key": "contact-idempotency-test",
})
assert(replayedIdempotent.status === 200, `/api/contact idempotent replay: expected 200, received ${replayedIdempotent.status}`)
assert(replayedIdempotent.json?.replayed === true, "/api/contact idempotent replay: expected replayed=true")

const conflictingIdempotent = await postJson(
  "/api/contact",
  {
    ...idempotentPayload,
    project: "This uses the same idempotency key but a different payload and should conflict.",
  },
  withTestClientIp({ "Idempotency-Key": "contact-idempotency-test" }),
)
assert(conflictingIdempotent.status === 409, `/api/contact idempotent conflict: expected 409, received ${conflictingIdempotent.status}`)

const wrongContentTypeResponse = await request("/api/contact", {
  method: "POST",
  headers: withTestClientIp({ "Content-Type": "text/plain" }),
  body: "invalid",
})
assert(wrongContentTypeResponse.status === 400, `/api/contact wrong content-type: expected 400, received ${wrongContentTypeResponse.status}`)

const unauthorizedReplay = await request("/api/contact/replay", {
  method: "GET",
})
assert(unauthorizedReplay.status === 401, `/api/contact/replay unauthorized GET: expected 401, received ${unauthorizedReplay.status}`)

const signedReplayDiagnostics = await request("/api/contact/replay", {
  method: "GET",
  headers: createSignedAdminHeaders("/api/contact/replay"),
})
assert(signedReplayDiagnostics.status === 200, `/api/contact/replay signed diagnostics: expected 200, received ${signedReplayDiagnostics.status}`)
assert(signedReplayDiagnostics.text.includes('"pipeline"'), "/api/contact/replay signed diagnostics: expected pipeline payload")

const replayDiagnostics = await request("/api/contact/replay", {
  method: "GET",
  headers: {
    Authorization: "Bearer test-admin-key",
  },
})
assert(replayDiagnostics.status === 200, `/api/contact/replay diagnostics: expected 200, received ${replayDiagnostics.status}`)
assert(replayDiagnostics.text.includes('"pipeline"'), "/api/contact/replay diagnostics: expected pipeline payload")

const replayWithoutReason = await request("/api/contact/replay", {
  method: "POST",
  headers: {
    Authorization: "Bearer test-admin-key",
    "X-Admin-Actor": "smoke-test",
  },
})
assert(replayWithoutReason.status === 400, `/api/contact/replay missing reason: expected 400, received ${replayWithoutReason.status}`)

const adminReplay = await request("/api/contact/replay", {
  method: "POST",
  headers: {
    Authorization: "Bearer test-admin-key",
    "X-Admin-Actor": "smoke-test",
    "X-Replay-Reason": "smoke test replay",
  },
})
assert(adminReplay.status === 200, `/api/contact/replay authorized: expected 200, received ${adminReplay.status}`)
assert(adminReplay.text.includes('"ok":true'), "/api/contact/replay authorized: expected ok=true")
assert(adminReplay.text.includes('"replay"'), "/api/contact/replay authorized: expected replay summary")
assert(adminReplay.text.includes('"lastSummary"'), "/api/contact/replay authorized: expected replay runtime summary")
assert(adminReplay.text.includes('"audit"'), "/api/contact/replay authorized: expected replay audit trail")
assert(adminReplay.text.includes('"reason":"smoke test replay"'), "/api/contact/replay authorized: expected replay reason in audit")

const unauthorizedCronReplay = await request("/api/contact/replay/cron", {
  method: "POST",
})
assert(unauthorizedCronReplay.status === 401, `/api/contact/replay/cron unauthorized: expected 401, received ${unauthorizedCronReplay.status}`)

const cronReplay = await request("/api/contact/replay/cron", {
  method: "POST",
  headers: {
    Authorization: "Bearer test-cron-secret",
  },
})
assert(cronReplay.status === 200, `/api/contact/replay/cron authorized: expected 200, received ${cronReplay.status}`)
assert(cronReplay.text.includes('"ok":true'), "/api/contact/replay/cron authorized: expected ok=true")

console.log(`Smoke checks passed for ${baseUrl}`)
