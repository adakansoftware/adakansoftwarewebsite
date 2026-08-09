"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Archive, Eye, LogOut, Plus, RotateCcw, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type ContentKind = "projects" | "logo_works"
type ContentRow = {
  id: string; title_tr: string; title_en: string; category_tr: string; category_en: string
  description_tr: string; description_en: string; year?: string; href?: string; initials?: string
  color: string; cover_image?: string | null; logo_image?: string | null; published: boolean; archived: boolean; sort_order: number
}
type EditableRow = ContentRow | Omit<ContentRow, "id">
type ApiError = { ok: false; message?: string }

const emptyRow = (kind: ContentKind): Omit<ContentRow, "id"> => ({
  title_tr: "", title_en: "", category_tr: "", category_en: "", description_tr: "", description_en: "",
  ...(kind === "projects" ? { year: String(new Date().getFullYear()), href: "", cover_image: null } : { initials: "", logo_image: null }),
  color: "#0066ff", published: false, archived: false, sort_order: 0,
})

export function AdminContentManager({ email }: { email: string }) {
  const [kind, setKind] = useState<ContentKind>("projects")
  const [rows, setRows] = useState<ContentRow[]>([])
  const [editing, setEditing] = useState<EditableRow>(emptyRow("projects"))
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<"all" | "published" | "draft" | "archived">("all")

  const load = async (target = kind) => {
    try {
      const response = await fetch(`/api/admin/content?type=${target}`, { cache: "no-store" })
      const data = await response.json() as ContentRow[] | ApiError
      if (!response.ok || !Array.isArray(data)) throw new Error(Array.isArray(data) ? "Veriler yüklenemedi." : data.message ?? "Veriler yüklenemedi.")
      setRows(data)
    } catch (error) { setMessage(error instanceof Error ? error.message : "Veriler yüklenemedi.") }
  }

  useEffect(() => { setEditing(emptyRow(kind)); void load(kind) }, [kind])

  const send = async (method: "POST" | "PATCH" | "DELETE", body: Record<string, unknown>) => {
    const response = await fetch("/api/admin/content", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: kind, ...body }) })
    const data = await response.json() as ApiError | ContentRow | { ok: true }
    if (!response.ok) throw new Error("message" in data ? data.message ?? "İşlem tamamlanamadı." : "İşlem tamamlanamadı.")
    return data
  }

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage("")
    try {
      await send("id" in editing ? "PATCH" : "POST", editing)
      setEditing(emptyRow(kind)); setMessage("Kaydedildi."); await load()
    } catch (error) { setMessage(error instanceof Error ? error.message : "Kayıt sırasında hata oluştu.") } finally { setBusy(false) }
  }

  const remove = async (id: string) => {
    if (!window.confirm("Bu kaydı silmek istiyor musun?")) return
    try { await send("DELETE", { id }); setMessage("Silindi."); await load() } catch (error) { setMessage(error instanceof Error ? error.message : "Silinemedi.") }
  }

  const update = (key: keyof ContentRow, value: string | boolean | number | null) => setEditing((current) => ({ ...current, [key]: value }) as EditableRow)
  const visibleRows = useMemo(() => rows.filter((row) => {
    const matchesText = `${row.title_tr} ${row.title_en}`.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = status === "all" || (status === "published" && row.published && !row.archived) || (status === "draft" && !row.published && !row.archived) || (status === "archived" && row.archived)
    return matchesText && matchesStatus
  }), [rows, query, status])
  const stats = { published: rows.filter((row) => row.published && !row.archived).length, draft: rows.filter((row) => !row.published && !row.archived).length, archived: rows.filter((row) => row.archived).length }
  const imageField = kind === "projects" ? "cover_image" : "logo_image"
  const imageValue = (editing[imageField] ?? "") as string

  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login" }
  const setArchived = async (row: ContentRow, archived: boolean) => {
    try { await send("PATCH", { ...row, archived }); setMessage(archived ? "Arşive taşındı." : "Arşivden çıkarıldı."); await load() } catch (error) { setMessage(error instanceof Error ? error.message : "İşlem tamamlanamadı.") }
  }

  return <div className="mx-auto min-h-screen max-w-6xl px-5 py-10 sm:px-8">
    <header className="mb-10 flex flex-col gap-5 border-b border-border/50 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="section-kicker">Yönetim paneli</p><h1 className="mt-3 text-3xl font-bold">İçerikleri yönet</h1><p className="mt-2 text-sm text-muted-foreground">{email}</p></div><Button variant="outline" onClick={() => void logout()}><LogOut /> Çıkış</Button></header>
    <div className="mb-8 flex gap-2">{(["projects", "logo_works"] as const).map((item) => <Button key={item} variant={kind === item ? "default" : "outline"} onClick={() => setKind(item)}>{item === "projects" ? "Projeler" : "Logolar"}</Button>)}<Button variant="ghost" onClick={() => setEditing(emptyRow(kind))}><Plus /> Yeni ekle</Button></div>
    <div className="mb-8 grid gap-3 sm:grid-cols-3">{[{ label: "Yayında", value: stats.published }, { label: "Taslak", value: stats.draft }, { label: "Arşiv", value: stats.archived }].map((item) => <div key={item.label} className="rounded-xl border border-border/50 bg-card/25 p-4"><p className="text-xs text-muted-foreground">{item.label}</p><p className="mt-1 text-2xl font-bold">{item.value}</p></div>)}</div>
    <div className="mb-5 flex flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="content-search">İçerik ara</label><input id="content-search" className="h-10 flex-1 rounded-md border border-border/60 bg-background/50 px-3 text-sm" placeholder="İçerik ara…" value={query} onChange={(event) => setQuery(event.target.value)} /><label className="sr-only" htmlFor="content-status">İçerik durumu</label><select id="content-status" className="h-10 rounded-md border border-border/60 bg-background/50 px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="all">Tümü</option><option value="published">Yayında</option><option value="draft">Taslak</option><option value="archived">Arşiv</option></select></div>
    <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]"><div className="space-y-3">{visibleRows.map((row) => <div key={row.id} className="rounded-xl border border-border/50 bg-card/25 p-4"><div className="flex items-start justify-between gap-3"><button className="text-left" onClick={() => setEditing(row)}><p className="font-semibold">{row.title_tr}</p><p className="mt-1 text-xs text-muted-foreground">{row.archived ? "Arşiv" : row.published ? "Yayında" : "Taslak"} · Sıra {row.sort_order}</p></button><div className="flex gap-1">{row.published && !row.archived && <Button size="icon-sm" variant="ghost" aria-label="Sitede önizle" onClick={() => window.open(kind === "projects" ? "/projects" : "/logo", "_blank")}><Eye /></Button>}<Button size="icon-sm" variant="ghost" aria-label={row.archived ? "Arşivden çıkar" : "Arşivle"} onClick={() => void setArchived(row, !row.archived)}>{row.archived ? <RotateCcw /> : <Archive />}</Button><Button size="icon-sm" variant="ghost" aria-label="Kalıcı sil" onClick={() => void remove(row.id)}><Trash2 /></Button></div></div></div>)}{!visibleRows.length && <p className="rounded-xl border border-dashed border-border/60 p-5 text-sm text-muted-foreground">Bu filtrede kayıt yok.</p>}</div>
      <form onSubmit={save} className="rounded-2xl border border-border/50 bg-card/25 p-5 sm:p-7"><h2 className="text-xl font-bold">{"id" in editing ? "Kaydı düzenle" : "Yeni kayıt"}</h2><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Başlık (TR)" value={editing.title_tr} onChange={(value) => update("title_tr", value)} /><Field label="Başlık (EN)" value={editing.title_en} onChange={(value) => update("title_en", value)} /><Field label="Kategori (TR)" value={editing.category_tr} onChange={(value) => update("category_tr", value)} /><Field label="Kategori (EN)" value={editing.category_en} onChange={(value) => update("category_en", value)} />{kind === "projects" ? <><Field label="Yıl" value={editing.year ?? ""} onChange={(value) => update("year", value)} /><Field label="Bağlantı" value={editing.href ?? ""} onChange={(value) => update("href", value)} /></> : <Field label="İnisiyal" value={editing.initials ?? ""} onChange={(value) => update("initials", value)} />}<Field label="Renk" value={editing.color} onChange={(value) => update("color", value)} /><Field label="Sıra" type="number" value={String(editing.sort_order)} onChange={(value) => update("sort_order", Number(value) || 0)} /><TextField label="Açıklama (TR)" value={editing.description_tr} onChange={(value) => update("description_tr", value)} /><TextField label="Açıklama (EN)" value={editing.description_en} onChange={(value) => update("description_en", value)} /></div><label className="mt-4 flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={editing.published} onChange={(event) => update("published", event.target.checked)} /> Yayında</label><Field label="Görsel URL (HTTPS)" value={imageValue} onChange={(value) => update(imageField, value || null)} /><p className="mt-2 text-xs text-muted-foreground">Görseli mevcut CDN veya barındırma hizmetinizden HTTPS URL olarak ekleyin.</p>{message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}<Button className="mt-6" type="submit" disabled={busy}><Save /> {busy ? "Kaydediliyor" : "Kaydet"}</Button></form>
    </div>
  </div>
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) { return <label className="text-sm font-medium">{label}<input required={label !== "Görsel URL (HTTPS)"} className="mt-2 h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 text-sm" type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label> }
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="text-sm font-medium sm:col-span-2">{label}<textarea required className="mt-2 min-h-24 w-full rounded-md border border-border/60 bg-background/50 p-3 text-sm" value={value} onChange={(event) => onChange(event.target.value)} /></label> }
