"use client"

import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { contactRequestContactHref, contactRequestStatusLabel, filterContactRequests, filterContactRequestsByStatus, formatContactRequestDate, replaceContactRequest, type AdminContactRequest, type ContactRequestStatus } from "@/lib/admin-contact"

type Status = ContactRequestStatus
type ContactRequest = AdminContactRequest

const statusClasses: Record<Status, string> = { new: "bg-blue-500/10 text-blue-700 dark:text-blue-300", in_progress: "bg-amber-500/10 text-amber-700 dark:text-amber-300", completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" }

export function AdminContactInbox() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [selected, setSelected] = useState<ContactRequest | null>(null)
  const [status, setStatus] = useState<Status>("new")
  const [note, setNote] = useState("")
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const load = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const response = await fetch("/api/admin/contact-requests", { cache: "no-store" })
      const data = await response.json() as ContactRequest[] | { message?: string }
      if (!response.ok || !Array.isArray(data)) throw new Error("İletişim talepleri yüklenemedi.")
      setRequests(data)
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "İletişim talepleri yüklenemedi.")
    } finally { setIsLoading(false) }
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
      const updated = await response.json() as ContactRequest
      if (!response.ok) throw new Error("İletişim talebi güncellenemedi.")
      setRequests((current) => replaceContactRequest(current, updated))
      setSelected(updated)
      setMessage("Kaydedildi.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "İletişim talebi güncellenemedi.")
    } finally {
      setBusy(false)
    }
  }

  const visibleRequests = useMemo(() => filterContactRequestsByStatus(filterContactRequests(requests, query), statusFilter), [requests, query, statusFilter])

  return (
    <section className="mt-12 border-t border-border/50 pt-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="section-kicker">İletişim kutusu</p><h2 className="mt-2 text-2xl font-bold">Proje talepleri</h2></div>
        <div className="flex gap-2 text-sm text-muted-foreground"><span>Yeni: {summary.new}</span><span>İnceleniyor: {summary.inProgress}</span><span>Tamamlandı: {summary.completed}</span></div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          <div className="flex gap-2"><label className="sr-only" htmlFor="contact-request-search">İletişim taleplerinde ara</label><input id="contact-request-search" className="h-10 min-w-0 flex-1 rounded-md border border-border/60 bg-background/50 px-3 text-sm" placeholder="Talep ara…" value={query} onChange={(event) => setQuery(event.target.value)} /><label className="sr-only" htmlFor="contact-request-status-filter">Talep durumu</label><select id="contact-request-status-filter" className="h-10 rounded-md border border-border/60 bg-background/50 px-3 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as Status | "all")}><option value="all">Tümü</option>{(["new", "in_progress", "completed"] as const).map((value) => <option key={value} value={value}>{contactRequestStatusLabel(value)}</option>)}</select></div>
          <p className="sr-only" aria-live="polite">{isLoading ? "İletişim talepleri yükleniyor" : `${visibleRequests.length} iletişim talebi gösteriliyor`}</p>
          {isLoading && <p className="rounded-xl border border-dashed border-border/60 p-5 text-sm text-muted-foreground">İletişim talepleri yükleniyor…</p>}
          {loadError && <div className="rounded-xl border border-destructive/40 p-5 text-sm text-destructive"><p>{loadError}</p><Button className="mt-3" size="sm" variant="outline" onClick={() => void load()}>Yeniden dene</Button></div>}
          {!isLoading && !loadError && visibleRequests.map((request) => <button key={request.id} onClick={() => open(request)} className="block w-full rounded-xl border border-border/50 bg-card/25 p-4 text-left transition-colors hover:border-primary/40"><div className="flex items-center justify-between gap-3"><p className="font-semibold">{request.name}</p><span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClasses[request.status]}`}>{contactRequestStatusLabel(request.status)}</span></div><p className="mt-1 text-sm text-muted-foreground">{request.email}{formatContactRequestDate(request.createdAt) ? ` · ${formatContactRequestDate(request.createdAt)}` : ""}</p><p className="mt-2 line-clamp-2 text-sm">{request.project}</p></button>)}
          {!isLoading && !loadError && !visibleRequests.length && <p className="rounded-xl border border-dashed border-border/60 p-5 text-sm text-muted-foreground">{requests.length ? "Aramanla eşleşen iletişim talebi yok." : "Henüz iletişim talebi yok."}</p>}
        </div>
        <div className="rounded-2xl border border-border/50 bg-card/25 p-5 sm:p-7">
          {selected ? <><p className="text-sm text-muted-foreground"><a className="underline underline-offset-2 hover:text-foreground" href={contactRequestContactHref("email", selected.email) ?? undefined}>{selected.email}</a>{selected.phone ? <><span aria-hidden="true"> · </span><a className="underline underline-offset-2 hover:text-foreground" href={contactRequestContactHref("phone", selected.phone) ?? undefined}>{selected.phone}</a></> : ""}</p><h3 className="mt-2 text-xl font-bold">{selected.name}</h3><p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed">{selected.project}</p><label className="mt-6 block text-sm font-medium">Durum<select className="mt-2 h-10 w-full rounded-md border border-border/60 bg-background/50 px-3" value={status} onChange={(event) => setStatus(event.target.value as Status)}>{(["new", "in_progress", "completed"] as const).map((value) => <option key={value} value={value}>{contactRequestStatusLabel(value)}</option>)}</select></label><label className="mt-4 block text-sm font-medium">Özel not<textarea className="mt-2 min-h-24 w-full rounded-md border border-border/60 bg-background/50 p-3" value={note} onChange={(event) => setNote(event.target.value)} /></label>{message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}<Button className="mt-5" onClick={() => void save()} disabled={busy}>{busy ? "Kaydediliyor" : "Talebi güncelle"}</Button></> : <p className="text-sm text-muted-foreground">Ayrıntıları görmek için bir talep seçin.</p>}
        </div>
      </div>
    </section>
  )
}
