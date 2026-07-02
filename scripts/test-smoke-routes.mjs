/* global console, fetch, process */

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
  { path: "/tr/about", status: 307, location: "/about" },
  { path: "/tr/privacy", status: 307, location: "/privacy" },
]

async function request(path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" })
  const html = response.status === 200 ? await response.text() : ""

  return {
    status: response.status,
    location: response.headers.get("location"),
    html,
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

  assert(
    result.status === check.status,
    `${check.path}: expected status ${check.status}, received ${result.status}`,
  )

  if (check.location) {
    assert(
      result.location === check.location,
      `${check.path}: expected redirect location ${check.location}, received ${result.location}`,
    )
  }

  if (check.htmlLang) {
    const langMatch = result.html.match(/<html lang="([^"]+)"/)
    assert(langMatch?.[1] === check.htmlLang, `${check.path}: expected html lang ${check.htmlLang}`)
  }

  if (check.includes) {
    for (const fragment of check.includes) {
      assert(result.html.includes(fragment), `${check.path}: missing expected fragment "${fragment}"`)
    }
  }
}

const invalidContact = await postJson("/api/contact", { email: "bad@example.com" })
assert(invalidContact.status === 400, `/api/contact invalid body: expected 400, received ${invalidContact.status}`)

const honeypotContact = await postJson("/api/contact", {
  name: "Bot User",
  email: "bot@example.com",
  project: "This should be silently accepted by the honeypot.",
  website: "https://spam.example",
})
assert(honeypotContact.status === 200, `/api/contact honeypot: expected 200, received ${honeypotContact.status}`)
assert(honeypotContact.json?.ok === true, "/api/contact honeypot: expected ok=true")

const wrongContentTypeResponse = await fetch(`${baseUrl}/api/contact`, {
  method: "POST",
  headers: { "Content-Type": "text/plain" },
  body: "invalid",
})
assert(wrongContentTypeResponse.status === 400, `/api/contact wrong content-type: expected 400, received ${wrongContentTypeResponse.status}`)

console.log(`Smoke checks passed for ${baseUrl}`)
