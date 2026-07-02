/* global console, fetch, process */

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

const getContact = await request("/api/contact")
assert(getContact.status === 405, `/api/contact GET: expected 405, received ${getContact.status}`)

const optionsHealth = await request("/api/health", { method: "OPTIONS" })
assert(optionsHealth.status === 204, `/api/health OPTIONS: expected 204, received ${optionsHealth.status}`)
assert(optionsHealth.headers.get("allow") === "GET, HEAD, OPTIONS", `/api/health OPTIONS: expected Allow header`)

const headHealth = await request("/api/health", { method: "HEAD" })
assert(headHealth.status === 200, `/api/health HEAD: expected 200, received ${headHealth.status}`)
assert(Boolean(headHealth.headers.get("x-request-id")), "/api/health HEAD: expected x-request-id header")

const invalidContact = await postJson("/api/contact", { email: "bad@example.com" })
assert(invalidContact.status === 400, `/api/contact invalid body: expected 400, received ${invalidContact.status}`)
assert(Boolean(invalidContact.headers.get("x-request-id")), "/api/contact invalid body: expected x-request-id header")

const invalidOrigin = await postJson(
  "/api/contact",
  {
    name: "Origin Test",
    email: "origin@example.com",
    project: "Origin validation should reject this request cleanly.",
  },
  { Origin: "https://evil.example" },
)
assert(invalidOrigin.status === 403, `/api/contact invalid origin: expected 403, received ${invalidOrigin.status}`)

const wrongContentTypeResponse = await request("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "text/plain" },
  body: "invalid",
})
assert(wrongContentTypeResponse.status === 400, `/api/contact wrong content-type: expected 400, received ${wrongContentTypeResponse.status}`)

console.log(`Smoke checks passed for ${baseUrl}`)
