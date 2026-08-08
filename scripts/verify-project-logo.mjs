import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import assert from "node:assert/strict"

const source = readFileSync(resolve("components/page-routes.tsx"), "utf8")
const logoPath = "/projects/salihogullari-hafriyat-logo.png"

assert.ok(existsSync(resolve(`public${logoPath}`)), "The Salihoğulları project logo asset must exist")
assert.match(source, /work\.logoImage/, "The project page's logo works section must render logo assets")
