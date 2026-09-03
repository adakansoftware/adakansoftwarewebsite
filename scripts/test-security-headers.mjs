/* global fetch, process */

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3101"
const response = await fetch(`${baseUrl}/`)

if (response.headers.get("strict-transport-security") !== "max-age=63072000; includeSubDomains; preload") {
  throw new Error("Expected production HSTS with subdomain and preload protection")
}

console.log(`Security header checks passed for ${baseUrl}`)
