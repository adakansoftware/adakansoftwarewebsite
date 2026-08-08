import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

const cookieName = "adakan_admin"

function signature(value: string) { return createHmac("sha256", process.env.ADMIN_SESSION_SECRET ?? "").update(value).digest("hex") }

export async function isAdmin() {
  const value = (await cookies()).get(cookieName)?.value
  if (!value) return false
  const [email, token] = value.split(".")
  const expected = signature(email)
  return email === process.env.ADMIN_EMAIL && token.length === expected.length && timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}

export function adminCookie() { const email = process.env.ADMIN_EMAIL ?? ""; return `${email}.${signature(email)}` }
export { cookieName }
