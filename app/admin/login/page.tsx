"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  useEffect(() => { void fetch("/api/admin/session", { cache: "no-store" }).then((response) => { if (response.ok) router.replace("/admin") }) }, [router])
  const signIn = async (event: FormEvent) => {
    event.preventDefault(); setError("")
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) })
      if (!response.ok) throw new Error("E-posta veya şifre hatalı.")
      router.replace("/admin")
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Giriş yapılamadı.") }
  }
  return <main className="grid min-h-screen place-items-center px-5"><form onSubmit={signIn} className="w-full max-w-md rounded-2xl border border-border/50 bg-card/25 p-7"><p className="section-kicker">Adakan Software</p><h1 className="mt-4 text-3xl font-bold">Yönetim girişi</h1><label className="mt-7 block text-sm font-medium">E-posta<input required type="email" autoComplete="username" spellCheck={false} className="mt-2 h-11 w-full rounded-md border border-border/60 bg-background/50 px-3" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className="mt-4 block text-sm font-medium">Şifre<input required type="password" autoComplete="current-password" className="mt-2 h-11 w-full rounded-md border border-border/60 bg-background/50 px-3" value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="mt-4 text-sm text-destructive" aria-live="polite">{error}</p>}<Button className="mt-6 w-full" type="submit">Giriş yap</Button></form></main>
}
