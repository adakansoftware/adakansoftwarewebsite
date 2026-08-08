"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminContentManager } from "@/components/admin/admin-content-manager"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

export default function AdminPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  useEffect(() => {
    void getSupabaseBrowserClient().auth.getSession().then(async ({ data }) => {
      const token = data.session?.access_token
      if (!token) return router.replace("/admin/login")
      const response = await fetch("/api/admin/session", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" })
      const result = await response.json() as { ok: boolean; email?: string }
      if (!result.ok) return router.replace("/admin/login")
      setEmail(result.email ?? "Yönetici")
    })
  }, [router])
  return email ? <AdminContentManager email={email} /> : <main className="grid min-h-screen place-items-center text-sm text-muted-foreground">Yükleniyor…</main>
}
