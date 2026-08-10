import { createHmac, timingSafeEqual } from "node:crypto"

function signature(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex")
}

export function createAdminSession(email: string, secret: string, expiresAt: number) {
  const encodedEmail = Buffer.from(email).toString("base64url")
  const payload = `${encodedEmail}.${expiresAt}`
  return `${payload}.${signature(payload, secret)}`
}

export function verifyAdminSession(
  value: string,
  email: string | undefined,
  secret: string,
  now: number,
) {
  if (!email?.trim() || !secret.trim()) return false
  const [encodedEmail, expiresAtValue, token] = value.split(".")
  if (!encodedEmail || !expiresAtValue || !token || value.split(".").length !== 3) return false

  const expiresAt = Number(expiresAtValue)
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false

  const payload = `${encodedEmail}.${expiresAtValue}`
  const expected = signature(payload, secret)
  if (token.length !== expected.length || !timingSafeEqual(Buffer.from(token), Buffer.from(expected))) return false

  try {
    return Buffer.from(encodedEmail, "base64url").toString("utf8") === email
  } catch {
    return false
  }
}
