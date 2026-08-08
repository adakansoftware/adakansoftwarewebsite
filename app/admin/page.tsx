"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminContentManager } from "@/components/admin/admin-content-manager"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

export default function AdminPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  useEffect(() => { void getSupabaseBrowserClient().auth.getUser().then(({ data }) => { if (!data.user) router.replace("/admin/login"); else setEmail(data.user.email ?? "Yönetici") }) }, [router])
  return email ? <AdminContentManager email={email} /> : <main className="grid min-h-screen place-items-center text-sm text-muted-foreground">Yükleniyor…</main>
}
