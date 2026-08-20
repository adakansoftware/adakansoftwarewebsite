import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import assert from "node:assert/strict"

const source = readFileSync(resolve("components/page-routes.tsx"), "utf8")
const homeSource = readFileSync(resolve("components/logo-works-section.tsx"), "utf8")
const showcaseSource = readFileSync(resolve("components/logo-showcase.tsx"), "utf8")
const logoPath = "/projects/salihogullari-hafriyat-logo.png"

assert.ok(existsSync(resolve(`public${logoPath}`)), "The Salihoğulları project logo asset must exist")
assert.match(source, /PortfolioLogoCard/, "The projects page must use the shared logo work card")
assert.match(homeSource, /PortfolioLogoCard/, "The home page must use the shared logo work card")
assert.match(showcaseSource, /PortfolioLogoCard/, "The logo page must use the shared logo work card")
