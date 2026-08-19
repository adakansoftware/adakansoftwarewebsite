import assert from "node:assert/strict"
import { access, stat } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import test from "node:test"
import sharp from "sharp"
import { getOptimizedLogoImage, getOptimizedProjectImage } from "./project-image-assets.ts"

const optimizedFiles = [
  "sallihogullari-hafriyat-cover.avif",
  "sallihogullari-hafriyat-cover.webp",
  "salihogullari-hafriyat-logo.avif",
  "salihogullari-hafriyat-logo.webp",
  "adakan-software-logo.avif",
  "adakan-software-logo.webp",
  "adakan-hafriyat-insaat-logo.avif",
  "adakan-hafriyat-insaat-logo.webp",
]

test("optimized project derivatives exist, are non-empty, and retain source dimensions", async () => {
  for (const filename of optimizedFiles) {
    const target = path.join(process.cwd(), "public", "projects", "optimized", filename)
    await access(target)
    assert.ok((await stat(target)).size > 0, `${filename} must not be empty`)

    const sourceName = filename.replace(/\.(avif|webp)$/, ".png")
    const source = path.join(process.cwd(), "public", "projects", sourceName)
    const [sourceMetadata, optimizedMetadata] = await Promise.all([sharp(source).metadata(), sharp(target).metadata()])

    assert.equal(optimizedMetadata.width, sourceMetadata.width, `${filename} width must match source`)
    assert.equal(optimizedMetadata.height, sourceMetadata.height, `${filename} height must match source`)
  }
})

test("maps existing public project images to AVIF derivatives", () => {
  assert.equal(
    getOptimizedProjectImage("/projects/sallihogullari-hafriyat-cover.png"),
    "/projects/optimized/sallihogullari-hafriyat-cover.avif",
  )
  assert.equal(
    getOptimizedLogoImage("/projects/adakan-software-logo.png"),
    "/projects/optimized/adakan-software-logo.avif",
  )
})
