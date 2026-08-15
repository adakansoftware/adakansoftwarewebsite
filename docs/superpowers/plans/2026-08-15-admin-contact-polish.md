# Yönetici İletişim Merkezi İyileştirmeleri Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Yönetici iletişim kutusunu aranabilir ve erişilebilir yapmak; ziyaretçi formunda teslimat durumunu açıkça göstermek.

**Architecture:** `lib/admin-contact.ts` API DTO ve saf arama/durum yardımcılarını barındırır. Route handler SQL satırlarını DTO'ya dönüştürür; istemci bileşeni bu DTO'ları filtreleyip erişilebilir durumları gösterir. İletişim formu mevcut API yanıtını ayrıştırarak uygun başarı metnini seçer.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Node test runner.

## Global Constraints

- Yetkilendirme, origin kontrolü ve mevcut API endpoint yolları değişmeyecek.
- Yeni bağımlılık eklenmeyecek.
- Yeni saf yardımcıların her biri test-first geliştirilecek.
- Her görev, bağımsız bir Conventional Commit ile tamamlanacak.

---

### Task 1: Tasarım ve Uygulama Planını Kaydet

**Files:**
- Create: `docs/superpowers/specs/2026-08-15-admin-contact-polish-design.md`
- Create: `docs/superpowers/plans/2026-08-15-admin-contact-polish.md`

- [ ] **Step 1: Tasarım ve planı gözden geçir**

Kapsamın DTO, arama, rozet, panel durumları ve form sonucu maddelerini içerdiğini doğrula.

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-08-15-admin-contact-polish-design.md docs/superpowers/plans/2026-08-15-admin-contact-polish.md
git commit -m "docs: plan admin contact inbox polish"
```

### Task 2: Kararlı İletişim Talebi DTO'su

**Files:**
- Modify: `lib/admin-contact.ts`
- Modify: `app/api/admin/contact-requests/route.ts`
- Test: `lib/admin-contact.test.mjs`

**Interfaces:**
- Produces: `toContactRequest(row: unknown): AdminContactRequest | null`

- [ ] **Step 1: Başarısız DTO testi yaz**

```js
assert.deepEqual(toContactRequest({ id, name: "Ada", email: "ada@example.com", status: "new" }), {
  id, name: "Ada", email: "ada@example.com", phone: null, project: "", locale: "tr", status: "new", adminNote: "", createdAt: null,
})
```

- [ ] **Step 2: Testi çalıştır ve eksik export nedeniyle başarısız olduğunu doğrula**

Run: `node --experimental-strip-types --test lib/admin-contact.test.mjs`

- [ ] **Step 3: DTO dönüştürücüsünü ekle ve route handler'da kullan**

```ts
return NextResponse.json(rows.map(toContactRequest).filter((row): row is AdminContactRequest => row !== null))
```

- [ ] **Step 4: Testi tekrar çalıştır**

Run: `node --experimental-strip-types --test lib/admin-contact.test.mjs`

- [ ] **Step 5: Commit**

```bash
git add lib/admin-contact.ts lib/admin-contact.test.mjs app/api/admin/contact-requests/route.ts
git commit -m "feat: stabilize admin contact request response"
```

### Task 3: Gelen Kutusu Araması

**Files:**
- Modify: `lib/admin-contact.ts`
- Modify: `components/admin/admin-contact-inbox.tsx`
- Test: `lib/admin-contact.test.mjs`

**Interfaces:**
- Produces: `filterContactRequests(requests, query): AdminContactRequest[]`

- [ ] **Step 1: Başarısız arama testi yaz**

```js
assert.equal(filterContactRequests([adaRequest, boraRequest], "ADA@EXAMPLE.COM").length, 1)
```

- [ ] **Step 2: Testi çalıştır ve eksik export nedeniyle başarısız olduğunu doğrula**

Run: `node --experimental-strip-types --test lib/admin-contact.test.mjs`

- [ ] **Step 3: Saf filtreyi ve etiketli arama alanını ekle**

```tsx
<input aria-label="İletişim taleplerinde ara" value={query} onChange={(event) => setQuery(event.target.value)} />
```

- [ ] **Step 4: Testi tekrar çalıştır**

Run: `node --experimental-strip-types --test lib/admin-contact.test.mjs`

- [ ] **Step 5: Commit**

```bash
git add lib/admin-contact.ts lib/admin-contact.test.mjs components/admin/admin-contact-inbox.tsx
git commit -m "feat: add admin contact request search"
```

### Task 4: Durum Rozetleri ve Panel Durumları

**Files:**
- Modify: `components/admin/admin-contact-inbox.tsx`

- [ ] **Step 1: Durum rozetlerini ekle**

`new`, `in_progress` ve `completed` durumlarını metin ve renk ile ayırt eden, salt metin anlamını koruyan rozetler kullan.

- [ ] **Step 2: Yükleniyor, hata ve filtre boş durumlarını ekle**

Başlangıç yüklemesinde açıklayıcı metin; hata oluştuğunda yeniden dene düğmesi; arama sonucu boşsa filtreye özgü metin göster.

- [ ] **Step 3: Commit**

```bash
git add components/admin/admin-contact-inbox.tsx
git commit -m "feat: improve admin contact inbox states"
```

### Task 5: İletişim Formu Teslimat Geri Bildirimi

**Files:**
- Modify: `components/contact-form.tsx`

- [ ] **Step 1: API yanıtını ayrıştır**

```ts
const result = await response.json() as { ok?: boolean; deliveryPending?: boolean }
if (!response.ok || !result.ok) throw new Error("contact-request-failed")
```

- [ ] **Step 2: Kuyruktaki teslimatlar için yerelleştirilmiş mesaj ekle**

`deliveryPending` true olduğunda ziyaretçiye talebinin alındığını ve teslimatın sürdüğünü bildir; aksi durumda mevcut başarı metnini kullan.

- [ ] **Step 3: Başarı mesajını canlı bölge olarak duyur**

```tsx
<p aria-live="polite" className="text-lg text-foreground">{successMessage}</p>
```

- [ ] **Step 4: Commit**

```bash
git add components/contact-form.tsx
git commit -m "feat: clarify contact delivery feedback"
```

### Task 6: Tüm Değişiklikleri Doğrula

**Files:**
- Verify only

- [ ] **Step 1: Yönetici testlerini çalıştır**

Run: `npm run test:admin-security`

- [ ] **Step 2: Linter çalıştır**

Run: `npm run lint`

- [ ] **Step 3: Üretim derlemesini çalıştır**

Run: `npm run build`
