import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"

const read = (path) => readFileSync(path, "utf8")

assert.ok(existsSync("lib/supabase/browser.ts"), "Missing browser Supabase client")
assert.ok(existsSync("lib/supabase/content.ts"), "Missing managed content loader")
assert.ok(existsSync("supabase/schema.sql"), "Missing Supabase schema")
assert.ok(existsSync("app/admin/login/page.tsx"), "Missing admin login page")
assert.ok(existsSync("app/admin/page.tsx"), "Missing admin page")
assert.match(read("supabase/schema.sql"), /create table (if not exists )?public\.projects/i)
assert.match(read("supabase/schema.sql"), /create table (if not exists )?public\.logo_works/i)
assert.match(read("supabase/schema.sql"), /portfolio-assets/)
assert.match(read("lib/supabase/content.ts"), /getManagedProjects/)
assert.match(read("lib/supabase/content.ts"), /getManagedLogoWorks/)
