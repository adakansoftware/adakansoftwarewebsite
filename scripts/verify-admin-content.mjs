import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"

const read = (path) => readFileSync(path, "utf8")

assert.ok(existsSync("lib/content.ts"), "Missing Neon managed content loader")
assert.ok(existsSync("neon/schema.sql"), "Missing Neon schema")
assert.ok(existsSync("app/admin/login/page.tsx"), "Missing admin login page")
assert.ok(existsSync("app/admin/page.tsx"), "Missing admin page")
assert.ok(existsSync("app/api/admin/content/route.ts"), "Missing Neon admin content API")
assert.ok(existsSync("app/api/admin/logout/route.ts"), "Missing admin logout route")
assert.match(read("neon/schema.sql"), /create table if not exists projects/i)
assert.match(read("neon/schema.sql"), /create table if not exists logo_works/i)
assert.match(read("neon/schema.sql"), /archived boolean/)
assert.match(read("lib/content.ts"), /getManagedProjects/)
assert.match(read("lib/content.ts"), /getManagedLogoWorks/)
assert.doesNotMatch(read("components/admin/admin-content-manager.tsx"), /getSupabaseBrowserClient/)
