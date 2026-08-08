"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { AdminContentManager } from "@/components/admin/admin-content-manager"

export default function AdminPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  useEffect(() => {
    void fetch("/api/admin/session", { cache: "no-store" }).then(async (response) => {
      const result = await response.json() as { ok: boolean; email?: string }
      if (!response.ok || !result.ok) return router.replace("/admin/login")
      setEmail(result.email ?? "Yönetici")
    }).catch(() => router.replace("/admin/login"))
  }, [router])
  return email ? <AdminContentManager email={email} /> : <main className="grid min-h-screen place-items-center text-sm text-muted-foreground">Yükleniyor…</main>
}
