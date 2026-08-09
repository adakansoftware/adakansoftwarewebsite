import { cookies } from "next/headers"

import { createAdminSession, verifyAdminSession } from "@/lib/admin-session"

const cookieName = "adakan_admin"
export const adminSessionMaxAgeSeconds = 8 * 60 * 60

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
  return createAdminSession(
    process.env.ADMIN_EMAIL ?? "",
    process.env.ADMIN_SESSION_SECRET ?? "",
    Date.now() + adminSessionMaxAgeSeconds * 1000,
  )
}
export { cookieName }
