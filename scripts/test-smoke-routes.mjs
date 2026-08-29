/* global console, fetch, process, URL */

import { createHmac, randomUUID } from "node:crypto"

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3101"

const checks = [
  { path: "/", status: 200, htmlLang: "tr", includes: ["Hizmetler", "data-mobile-menu"] },
  { path: "/about", status: 200, htmlLang: "tr", includes: ["Hakkımızda"] },
  { path: "/contact", status: 200, htmlLang: "tr", includes: ["WhatsApp", "data-mobile-menu"] },
  { path: "/privacy", status: 200, htmlLang: "tr", includes: ["Gizlilik"] },
  { path: "/terms", status: 200, htmlLang: "tr", includes: ["Kullanım"] },
  { path: "/en/about", status: 200, htmlLang: "en", includes: ["About", "/en/services"] },
  { path: "/en/contact", status: 200, htmlLang: "en", includes: ["WhatsApp", "Start a Project"] },
  { path: "/en/privacy", status: 200, htmlLang: "en", includes: ["Privacy"] },
  { path: "/en/terms", status: 200, htmlLang: "en", includes: ["Terms"] },
  { path: "/tr/about", status: 307, locationPath: "/about" },
  { path: "/api/health", status: 200, includes: ['"ok":true', '"service":"adakansoftware-website"'] },
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
  const nonce = headers["X-Admin-Nonce"] ?? headers["x-admin-nonce"] ?? randomUUID()
  const method = headers["X-Signed-Method"] ?? headers["x-signed-method"] ?? "GET"
  const payload = `${method}\n${path}\n${timestamp}\n${actor}\n${reason}\n${nonce}`
  const signature = createHmac("sha256", "test-admin-signing-secret").update(payload).digest("hex")

  return {
    "X-Admin-Timestamp": timestamp,
    "X-Admin-Actor": actor,
    "X-Admin-Nonce": nonce,
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

  if (check.locationPath) {
    assert(
      result.location && new URL(result.location, baseUrl).pathname === check.locationPath,
      `${check.path}: expected redirect path ${check.locationPath}, received ${result.location}`,
    )
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

const servicesSeoPage = await request("/services")
assert(!servicesSeoPage.text.includes('"@type":"BreadcrumbList"'), "/services: must not publish invisible breadcrumb structured data")

const ogImage = await request("/og?page=services")
assert(ogImage.status === 200, `/og: expected 200, received ${ogImage.status}`)
assert(ogImage.headers.get("content-type")?.startsWith("image/png"), "/og: expected PNG response")
assert(
  ogImage.headers.get("cache-control") === "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
  "/og: expected shared cache policy",
)

const optimizedProjectImage = await request("/projects/optimized/sallihogullari-hafriyat-cover.avif")
assert(optimizedProjectImage.status === 200, `/optimized project image: expected 200, received ${optimizedProjectImage.status}`)
assert(
  optimizedProjectImage.headers.get("cache-control") === "public, max-age=31536000, immutable",
  "/optimized project image: expected immutable cache policy",
)

const optionsContact = await request("/api/contact", { method: "OPTIONS" })
assert(optionsContact.status === 204, `/api/contact OPTIONS: expected 204, received ${optionsContact.status}`)
assert(optionsContact.headers.get("allow") === "POST, OPTIONS", `/api/contact OPTIONS: expected Allow header`)

const optionsReplay = await request("/api/contact/replay", { method: "OPTIONS" })
assert(optionsReplay.status === 204, `/api/contact/replay OPTIONS: expected 204, received ${optionsReplay.status}`)
assert(optionsReplay.headers.get("allow") === "GET, POST, OPTIONS", `/api/contact/replay OPTIONS: expected Allow header`)

const optionsReplayCron = await request("/api/contact/replay/cron", { method: "OPTIONS" })
assert(optionsReplayCron.status === 204, `/api/contact/replay/cron OPTIONS: expected 204, received ${optionsReplayCron.status}`)
assert(optionsReplayCron.headers.get("allow") === "GET, POST, OPTIONS", `/api/contact/replay/cron OPTIONS: expected Allow header`)

const optionsState = await request("/api/contact/state", { method: "OPTIONS" })
assert(optionsState.status === 204, `/api/contact/state OPTIONS: expected 204, received ${optionsState.status}`)
assert(optionsState.headers.get("allow") === "GET, OPTIONS", `/api/contact/state OPTIONS: expected Allow header`)

const getContact = await request("/api/contact")
assert(getContact.status === 405, `/api/contact GET: expected 405, received ${getContact.status}`)

const unauthenticatedAdminSession = await request("/api/admin/session")
assert(unauthenticatedAdminSession.status === 401, `/api/admin/session: expected 401 without cookie, received ${unauthenticatedAdminSession.status}`)

const unauthenticatedAdminContent = await request("/api/admin/content?type=projects")
assert(unauthenticatedAdminContent.status === 401, `/api/admin/content: expected 401 without cookie, received ${unauthenticatedAdminContent.status}`)

const unauthenticatedContactRequests = await request("/api/admin/contact-requests")
assert(unauthenticatedContactRequests.status === 401, `/api/admin/contact-requests: expected 401 without cookie, received ${unauthenticatedContactRequests.status}`)

const optionsHealth = await request("/api/health", { method: "OPTIONS" })
assert(optionsHealth.status === 204, `/api/health OPTIONS: expected 204, received ${optionsHealth.status}`)
assert(optionsHealth.headers.get("allow") === "GET, HEAD, OPTIONS", `/api/health OPTIONS: expected Allow header`)

const headHealth = await request("/api/health", { method: "HEAD" })
assert(headHealth.status === 200, `/api/health HEAD: expected 200, received ${headHealth.status}`)
assert(Boolean(headHealth.headers.get("x-request-id")), "/api/health HEAD: expected x-request-id header")

const publicHealth = await request("/api/health")
assert(!publicHealth.text.includes('"checks"'), "/api/health public: must not expose security checks")
assert(!publicHealth.text.includes('"environment"'), "/api/health public: must not expose runtime environment")
assert(!publicHealth.text.includes('"pipeline"'), "/api/health public: must not expose pipeline diagnostics")
assert(!publicHealth.text.includes('"worker"'), "/api/health public: must not expose worker diagnostics")
assert(!publicHealth.text.includes('"outbox"'), "/api/health public: must not expose outbox diagnostics")

const adminHealth = await request("/api/health", {
  headers: {
    Authorization: "Bearer test-admin-key",
  },
})
assert(adminHealth.status === 200, `/api/health admin: expected 200, received ${adminHealth.status}`)
assert(adminHealth.text.includes('"pipeline"'), "/api/health admin: expected pipeline diagnostics")

const signedHealth = await request("/api/health", {
  headers: createSignedAdminHeaders("/api/health"),
})
assert(signedHealth.status === 200, `/api/health signed: expected 200, received ${signedHealth.status}`)
assert(signedHealth.text.includes('"pipeline"'), "/api/health signed: expected diagnostics")

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

const concurrentContactResponses = await Promise.all(
  Array.from({ length: 4 }, (_, index) =>
    postJson(
      "/api/contact",
      {
        name: `Concurrent User ${index + 1}`,
        email: `concurrent-${index + 1}@example.com`,
        project: `This concurrent submission ${index + 1} verifies that outbox writes do not overwrite one another.`,
      },
      {
        ...withTestClientIp(),
        "Idempotency-Key": `contact-concurrency-test-${index + 1}`,
      },
    ),
  ),
)
for (const [index, response] of concurrentContactResponses.entries()) {
  assert(response.status === 200, `/api/contact concurrent ${index + 1}: expected 200, received ${response.status}`)
  assert(typeof response.json?.messageId === "string", `/api/contact concurrent ${index + 1}: expected messageId`)
}

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

const oversizedContactResponse = await postJson(
  "/api/contact",
  {
    name: "Oversized payload test",
    email: "oversized@example.com",
    project: "x".repeat(13_000),
  },
  withTestClientIp(),
)
assert(oversizedContactResponse.status === 413, `/api/contact oversized payload: expected 413, received ${oversizedContactResponse.status}`)

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

const reusedSignedHeaders = createSignedAdminHeaders("/api/contact/replay")
const firstNonceReplay = await request("/api/contact/replay", {
  method: "GET",
  headers: reusedSignedHeaders,
})
assert(firstNonceReplay.status === 200, `/api/contact/replay signed nonce first use: expected 200, received ${firstNonceReplay.status}`)

const repeatedNonceReplay = await request("/api/contact/replay", {
  method: "GET",
  headers: reusedSignedHeaders,
})
assert(repeatedNonceReplay.status === 401, `/api/contact/replay signed nonce replay: expected 401, received ${repeatedNonceReplay.status}`)

const replayDiagnostics = await request("/api/contact/replay", {
  method: "GET",
  headers: {
    Authorization: "Bearer test-admin-key",
  },
})
assert(replayDiagnostics.status === 200, `/api/contact/replay diagnostics: expected 200, received ${replayDiagnostics.status}`)
assert(replayDiagnostics.text.includes('"pipeline"'), "/api/contact/replay diagnostics: expected pipeline payload")
const replayDiagnosticsPayload = JSON.parse(replayDiagnostics.text)
const recentOutboxIds = replayDiagnosticsPayload.pipeline.outbox.recent.map((entry) => entry.id)
for (const response of concurrentContactResponses) {
  assert(recentOutboxIds.includes(response.json.messageId), "/api/contact concurrent: expected message in outbox diagnostics")
}

const stateDiagnostics = await request("/api/contact/state", {
  method: "GET",
  headers: {
    Authorization: "Bearer test-admin-key",
  },
})
assert(stateDiagnostics.status === 200, `/api/contact/state diagnostics: expected 200, received ${stateDiagnostics.status}`)
assert(stateDiagnostics.text.includes('"backend":"file"'), "/api/contact/state diagnostics: expected file backend")
assert(stateDiagnostics.text.includes('"sharedStoreReady":false'), "/api/contact/state diagnostics: expected local file backend")
assert(stateDiagnostics.text.includes('"implementedBackends":["file","redis"]'), "/api/contact/state diagnostics: expected implemented backends")
assert(stateDiagnostics.text.includes('"requestedBackendImplemented":true'), "/api/contact/state diagnostics: expected implemented backend")
assert(stateDiagnostics.text.includes('"requestedBackendReady":true'), "/api/contact/state diagnostics: expected ready backend")
assert(stateDiagnostics.text.includes('"available":true'), "/api/contact/state diagnostics: expected available backend")
assert(stateDiagnostics.text.includes('"worker"'), "/api/contact/state diagnostics: expected worker runtime payload")

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
    "X-Worker-Id": "smoke-worker",
  },
})
assert(cronReplay.status === 200, `/api/contact/replay/cron authorized: expected 200, received ${cronReplay.status}`)
assert(cronReplay.text.includes('"ok":true'), "/api/contact/replay/cron authorized: expected ok=true")

const vercelCronReplay = await request("/api/contact/replay/cron", {
  method: "GET",
  headers: {
    Authorization: "Bearer test-cron-secret",
    "X-Worker-Id": "vercel-smoke-worker",
  },
})
assert(vercelCronReplay.status === 200, `/api/contact/replay/cron GET: expected 200, received ${vercelCronReplay.status}`)
assert(vercelCronReplay.text.includes('"ok":true'), "/api/contact/replay/cron GET: expected ok=true")

console.log(`Smoke checks passed for ${baseUrl}`)
