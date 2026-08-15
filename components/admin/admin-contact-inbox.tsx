"use client"

import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { filterContactRequests, type AdminContactRequest, type ContactRequestStatus } from "@/lib/admin-contact"

type Status = ContactRequestStatus
type ContactRequest = AdminContactRequest

const statusLabels: Record<Status, string> = {
  new: "Yeni",
  in_progress: "İnceleniyor",
  completed: "Tamamlandı",
}

export function AdminContactInbox() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [selected, setSelected] = useState<ContactRequest | null>(null)
  const [status, setStatus] = useState<Status>("new")
  const [note, setNote] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const [query, setQuery] = useState("")

  const load = async () => {
    try {
      const response = await fetch("/api/admin/contact-requests", { cache: "no-store" })
      const data = await response.json() as ContactRequest[] | { message?: string }
      if (!response.ok || !Array.isArray(data)) throw new Error("İletişim talepleri yüklenemedi.")
      setRequests(data)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "İletişim talepleri yüklenemedi.")
    }
  }

  useEffect(() => { void load() }, [])

  const summary = useMemo(() => ({
    new: requests.filter((request) => request.status === "new").length,
    inProgress: requests.filter((request) => request.status === "in_progress").length,
    completed: requests.filter((request) => request.status === "completed").length,
  }), [requests])

  const open = (request: ContactRequest) => {
    setSelected(request)
    setStatus(request.status)
    setNote(request.adminNote)
    setMessage("")
  }

  const save = async () => {
    if (!selected) return
    setBusy(true)
    setMessage("")
    try {
      const response = await fetch("/api/admin/contact-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selected.id, status, adminNote: note }),
      })
      if (!response.ok) throw new Error("İletişim talebi güncellenemedi.")
      setMessage("Kaydedildi.")
      await load()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "İletişim talebi güncellenemedi.")
    } finally {
      setBusy(false)
    }
  }

  const visibleRequests = useMemo(() => filterContactRequests(requests, query), [requests, query])

  return (
    <section className="mt-12 border-t border-border/50 pt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="section-kicker">İletişim kutusu</p><h2 className="mt-2 text-2xl font-bold">Proje talepleri</h2></div>
        <div className="flex gap-2 text-sm text-muted-foreground"><span>Yeni: {summary.new}</span><span>İnceleniyor: {summary.inProgress}</span><span>Tamamlandı: {summary.completed}</span></div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          <label className="sr-only" htmlFor="contact-request-search">İletişim taleplerinde ara</label><input id="contact-request-search" className="h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 text-sm" placeholder="Talep ara…" value={query} onChange={(event) => setQuery(event.target.value)} />
          {visibleRequests.map((request) => <button key={request.id} onClick={() => open(request)} className="block w-full rounded-xl border border-border/50 bg-card/25 p-4 text-left transition-colors hover:border-primary/40"><div className="flex items-center justify-between gap-3"><p className="font-semibold">{request.name}</p><span className="text-xs text-muted-foreground">{statusLabels[request.status]}</span></div><p className="mt-1 text-sm text-muted-foreground">{request.email}</p><p className="mt-2 line-clamp-2 text-sm">{request.project}</p></button>)}
          {!visibleRequests.length && <p className="rounded-xl border border-dashed border-border/60 p-5 text-sm text-muted-foreground">Henüz iletişim talebi yok.</p>}
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/25 p-5 sm:p-7">
          {selected ? <><p className="text-sm text-muted-foreground">{selected.email}{selected.phone ? ` · ${selected.phone}` : ""}</p><h3 className="mt-2 text-xl font-bold">{selected.name}</h3><p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed">{selected.project}</p><label className="mt-6 block text-sm font-medium">Durum<select className="mt-2 h-10 w-full rounded-md border border-border/60 bg-background/50 px-3" value={status} onChange={(event) => setStatus(event.target.value as Status)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="mt-4 block text-sm font-medium">Özel not<textarea className="mt-2 min-h-24 w-full rounded-md border border-border/60 bg-background/50 p-3" value={note} onChange={(event) => setNote(event.target.value)} /></label>{message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}<Button className="mt-5" onClick={() => void save()} disabled={busy}>{busy ? "Kaydediliyor" : "Talebi güncelle"}</Button></> : <p className="text-sm text-muted-foreground">Ayrıntıları görmek için bir talep seçin.</p>}
        </div>
      </div>
    </section>
  )
}
