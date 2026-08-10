import { cookies } from "next/headers"

import { createAdminSession, verifyAdminSession } from "@/lib/admin-session"

const cookieName = "adakan_admin"
export const adminSessionMaxAgeSeconds = 8 * 60 * 60

export function hasAdminSessionConfiguration() {
  return Boolean(process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_SESSION_SECRET?.trim())
}

export async function isAdmin() {
  const value = (await cookies()).get(cookieName)?.value
  if (!value) return false
  return verifyAdminSession(
    value,
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_SESSION_SECRET ?? "",
    Date.now(),
  )
}

export function adminCookie() {
  if (!hasAdminSessionConfiguration()) {
    throw new Error("Admin session configuration is incomplete.")
  }

  return createAdminSession(
    process.env.ADMIN_EMAIL ?? "",
    process.env.ADMIN_SESSION_SECRET ?? "",
    Date.now() + adminSessionMaxAgeSeconds * 1000,
  )
}
export { cookieName }
