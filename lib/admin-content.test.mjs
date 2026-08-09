import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

import { parseContentKind, parseContentPayload } from "./admin-content.ts"

test("accepts only known content kinds", () => {
  assert.equal(parseContentKind("projects"), "projects")
  assert.equal(parseContentKind("logo_works"), "logo_works")
  assert.equal(parseContentKind("projects; drop table projects"), null)
})

test("requires project fields and validates image URLs", () => {
  const valid = parseContentPayload("projects", {
    title_tr: "Başlık",
    title_en: "Title",
    category_tr: "Kategori",
    category_en: "Category",
    description_tr: "Açıklama",
    description_en: "Description",
    year: "2026",
    href: "/projects/example",
    color: "#0066ff",
    cover_image: "https://images.example.com/cover.webp",
    published: true,
    archived: false,
    sort_order: 2,
  })
  assert.equal(valid.ok, true)
  if (!valid.ok) return
  assert.equal(valid.data.cover_image, "https://images.example.com/cover.webp")

  const invalid = parseContentPayload("projects", { ...valid.data, cover_image: "javascript:alert(1)" })
  assert.deepEqual(invalid, { ok: false, message: "Geçerli bir görsel URL’si girin." })
})

test("rejects unsafe project links", () => {
  const base = {
    title_tr: "Başlık",
    title_en: "Title",
    category_tr: "Kategori",
    category_en: "Category",
    description_tr: "Açıklama",
    description_en: "Description",
    year: "2026",
    color: "#0066ff",
    cover_image: null,
    published: true,
    archived: false,
    sort_order: 2,
  }

  assert.equal(parseContentPayload("projects", { ...base, href: "/projects/example" }).ok, true)
  assert.equal(parseContentPayload("projects", { ...base, href: "https://example.com" }).ok, true)
  assert.equal(parseContentPayload("projects", { ...base, href: "javascript:alert(1)" }).ok, false)
  assert.equal(parseContentPayload("projects", { ...base, href: "//evil.example" }).ok, false)
  assert.equal(parseContentPayload("projects", { ...base, href: "/\\evil.example" }).ok, false)
  assert.equal(parseContentPayload("projects", { ...base, href: "http://example.com" }).ok, false)
})

test("admin manager does not import the Supabase browser client", () => {
  const source = readFileSync("components/admin/admin-content-manager.tsx", "utf8")
  assert.doesNotMatch(source, /getSupabaseBrowserClient/)
})

test("package does not declare Supabase", () => {
  const packageJson = readFileSync("package.json", "utf8")
  assert.doesNotMatch(packageJson, /@supabase\/supabase-js/)
})
