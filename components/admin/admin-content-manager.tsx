"use client"

import { FormEvent, useEffect, useState } from "react"
import { LogOut, Plus, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

type ContentKind = "projects" | "logo_works"

type ContentRow = {
  id: string
  title_tr: string
  title_en: string
  category_tr: string
  category_en: string
  description_tr: string
  description_en: string
  year?: string
  href?: string
  initials?: string
  color: string
  cover_image?: string | null
  logo_image?: string | null
  published: boolean
  sort_order: number
}

const emptyRow = (kind: ContentKind): Omit<ContentRow, "id"> => ({
  title_tr: "",
  title_en: "",
  category_tr: "",
  category_en: "",
  description_tr: "",
  description_en: "",
  ...(kind === "projects" ? { year: String(new Date().getFullYear()), href: "" } : { initials: "" }),
  color: "#0066ff",
  published: false,
  sort_order: 0,
})

export function AdminContentManager({ email }: { email: string }) {
  const [kind, setKind] = useState<ContentKind>("projects")
  const [rows, setRows] = useState<ContentRow[]>([])
  const [editing, setEditing] = useState<ContentRow | Omit<ContentRow, "id">>(emptyRow("projects"))
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState("")
  const [busy, setBusy] = useState(false)

  const load = async (target = kind) => {
    const { data, error } = target === "projects"
      ? await getSupabaseBrowserClient().from("projects").select("*").order("sort_order")
      : await getSupabaseBrowserClient().from("logo_works").select("*").order("sort_order")
    setRows((data as ContentRow[] | null) ?? [])
    if (error) setMessage(`Veriler yüklenemedi: ${error.message}`)
  }

  useEffect(() => {
    setEditing(emptyRow(kind))
    setFile(null)
    void load(kind)
  }, [kind])

  const upload = async () => {
    if (!file) return null
    if (!["image/png", "image/jpeg", "image/webp", "image/svg+xml"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      throw new Error("PNG, JPG, WebP veya SVG dosyası seç; boyut en fazla 5 MB olabilir.")
    }
    const path = `${kind}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`
    const storage = getSupabaseBrowserClient().storage.from("portfolio-assets")
    const { error } = await storage.upload(path, file, { upsert: false })
    if (error) throw error
    return storage.getPublicUrl(path).data.publicUrl
  }

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setMessage("")
    try {
      const image = await upload()
      const imageField = kind === "projects" ? "cover_image" : "logo_image"
      const payload = { ...editing, ...(image ? { [imageField]: image } : {}) }
      const { error } = kind === "projects"
        ? "id" in editing
          ? await getSupabaseBrowserClient().from("projects").update(payload as never).eq("id", editing.id)
          : await getSupabaseBrowserClient().from("projects").insert(payload as never)
        : "id" in editing
          ? await getSupabaseBrowserClient().from("logo_works").update(payload as never).eq("id", editing.id)
          : await getSupabaseBrowserClient().from("logo_works").insert(payload as never)
      if (error) throw error
      setEditing(emptyRow(kind))
      setFile(null)
      setMessage("Kaydedildi.")
      await load()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kayıt sırasında hata oluştu.")
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm("Bu kaydı silmek istiyor musun?")) return
    const { error } = kind === "projects"
      ? await getSupabaseBrowserClient().from("projects").delete().eq("id", id)
      : await getSupabaseBrowserClient().from("logo_works").delete().eq("id", id)
    setMessage(error ? error.message : "Silindi.")
    await load()
  }

  const update = (key: keyof ContentRow, value: string | boolean | number) => setEditing((current) => ({ ...current, [key]: value }))

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-5 py-10 sm:px-8">
      <header className="mb-10 flex flex-col gap-5 border-b border-border/50 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="section-kicker">Yönetim paneli</p><h1 className="mt-3 text-3xl font-bold">İçerikleri yönet</h1><p className="mt-2 text-sm text-muted-foreground">{email}</p></div>
        <Button variant="outline" onClick={async () => { await getSupabaseBrowserClient().auth.signOut(); window.location.href = "/admin/login" }}><LogOut /> Çıkış</Button>
      </header>

      <div className="mb-8 flex gap-2">
        {(["projects", "logo_works"] as const).map((item) => <Button key={item} variant={kind === item ? "default" : "outline"} onClick={() => setKind(item)}>{item === "projects" ? "Projeler" : "Logolar"}</Button>)}
        <Button variant="ghost" onClick={() => setEditing(emptyRow(kind))}><Plus /> Yeni ekle</Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-3">
          {rows.map((row) => <div key={row.id} className="rounded-xl border border-border/50 bg-card/25 p-4"><div className="flex items-start justify-between gap-3"><button className="text-left" onClick={() => setEditing(row)}><p className="font-semibold">{row.title_tr}</p><p className="mt-1 text-xs text-muted-foreground">{row.published ? "Yayında" : "Taslak"} · Sıra {row.sort_order}</p></button><Button size="icon-sm" variant="ghost" aria-label="Kaydı sil" onClick={() => void remove(row.id)}><Trash2 /></Button></div></div>)}
          {!rows.length && <p className="rounded-xl border border-dashed border-border/60 p-5 text-sm text-muted-foreground">Henüz kayıt yok.</p>}
        </div>
        <form onSubmit={save} className="rounded-2xl border border-border/50 bg-card/25 p-5 sm:p-7">
          <h2 className="text-xl font-bold">{"id" in editing ? "Kaydı düzenle" : "Yeni kayıt"}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Başlık (TR)" value={editing.title_tr} onChange={(value) => update("title_tr", value)} />
            <Field label="Başlık (EN)" value={editing.title_en} onChange={(value) => update("title_en", value)} />
            <Field label="Kategori (TR)" value={editing.category_tr} onChange={(value) => update("category_tr", value)} />
            <Field label="Kategori (EN)" value={editing.category_en} onChange={(value) => update("category_en", value)} />
            {kind === "projects" ? <><Field label="Yıl" value={editing.year ?? ""} onChange={(value) => update("year", value)} /><Field label="Bağlantı" value={editing.href ?? ""} onChange={(value) => update("href", value)} /></> : <Field label="İnisiyal" value={editing.initials ?? ""} onChange={(value) => update("initials", value)} />}
            <Field label="Renk" value={editing.color} onChange={(value) => update("color", value)} />
            <Field label="Sıra" type="number" value={String(editing.sort_order)} onChange={(value) => update("sort_order", Number(value) || 0)} />
            <TextField label="Açıklama (TR)" value={editing.description_tr} onChange={(value) => update("description_tr", value)} />
            <TextField label="Açıklama (EN)" value={editing.description_en} onChange={(value) => update("description_en", value)} />
          </div>
          <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={editing.published} onChange={(event) => update("published", event.target.checked)} /> Yayında</label>
          <label className="mt-5 block text-sm font-medium">Görsel yükle<input className="mt-2 block w-full text-sm text-muted-foreground" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>
          {message && <p className="mt-4 text-sm text-muted-foreground">{message}</p>}
          <Button className="mt-6" type="submit" disabled={busy}><Save /> {busy ? "Kaydediliyor" : "Kaydet"}</Button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) { return <label className="text-sm font-medium">{label}<input required className="mt-2 h-10 w-full rounded-md border border-border/60 bg-background/50 px-3 text-sm outline-none focus:border-primary" type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label> }
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="text-sm font-medium sm:col-span-2">{label}<textarea required className="mt-2 min-h-24 w-full rounded-md border border-border/60 bg-background/50 p-3 text-sm outline-none focus:border-primary" value={value} onChange={(event) => onChange(event.target.value)} /></label> }
