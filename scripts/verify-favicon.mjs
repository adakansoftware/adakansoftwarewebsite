import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"

assert.ok(existsSync("public/favicon.png"), "Missing custom Adakan favicon asset")
const layout = readFileSync("app/layout.tsx", "utf8")
assert.match(layout, /url: "\/favicon\.png"/, "The custom Adakan favicon must be the primary icon")
