import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import assert from "node:assert/strict"

const source = readFileSync(resolve("components/page-routes.tsx"), "utf8")
const showcaseSource = readFileSync(resolve("components/logo-showcase.tsx"), "utf8")
const logoPath = "/projects/salihogullari-hafriyat-logo.png"

assert.ok(existsSync(resolve(`public${logoPath}`)), "The Salihoğulları project logo asset must exist")
assert.match(source, /work\.logoImage/, "The project page's logo works section must render logo assets")
assert.match(showcaseSource, /max-h-\[72%\] w-\[82%\]/, "The logo page must use the same centered logo sizing as the projects showcase")
