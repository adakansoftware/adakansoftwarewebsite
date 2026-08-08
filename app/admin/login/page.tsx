"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  useEffect(() => { void getSupabaseBrowserClient().auth.getUser().then(({ data }) => { if (data.user) router.replace("/admin") }) }, [router])
  const signIn = async (event: FormEvent) => { event.preventDefault(); setError(""); const { error } = await getSupabaseBrowserClient().auth.signInWithPassword({ email, password }); if (error) setError(error.message); else router.replace("/admin") }
  return <main className="grid min-h-screen place-items-center px-5"><form onSubmit={signIn} className="w-full max-w-md rounded-2xl border border-border/50 bg-card/25 p-7"><p className="section-kicker">Adakan Software</p><h1 className="mt-4 text-3xl font-bold">Yönetim girişi</h1><label className="mt-7 block text-sm font-medium">E-posta<input required type="email" className="mt-2 h-11 w-full rounded-md border border-border/60 bg-background/50 px-3 outline-none focus:border-primary" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className="mt-4 block text-sm font-medium">Şifre<input required type="password" className="mt-2 h-11 w-full rounded-md border border-border/60 bg-background/50 px-3 outline-none focus:border-primary" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="mt-4 text-sm text-destructive">{error}</p>}<Button className="mt-6 w-full" type="submit">Giriş yap</Button></form></main>
}
