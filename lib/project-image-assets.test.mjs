import assert from "node:assert/strict"
import { access, stat } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import test from "node:test"
import sharp from "sharp"

import { getOptimizedLogoImage, getOptimizedProjectImage } from "./project-image-assets.ts"

const derivatives = [
  ["sallihogullari-hafriyat-cover", "sallihogullari-hafriyat-cover"],
  ["salihogullari-hafriyat-logo", "salihogullari-hafriyat-logo"],
  ["adakan-software-logo", "adakan-software-logo"],
  ["adakan-hafriyat-insaat-logo", "adakan-hafriyat-insaat-logo"],
]

test("optimized project derivatives exist and retain source dimensions", async () => {
  for (const [sourceName, derivativeName] of derivatives) {
    const source = path.join(process.cwd(), "public", "projects", `${sourceName}.png`)
    const sourceMetadata = await sharp(source).metadata()

    for (const extension of ["avif", "webp"]) {
      const target = path.join(process.cwd(), "public", "projects", "optimized", `${derivativeName}.${extension}`)
      await access(target)
      assert.ok((await stat(target)).size > 0, `${derivativeName}.${extension} must not be empty`)

      const metadata = await sharp(target).metadata()
      assert.equal(metadata.width, sourceMetadata.width, `${derivativeName}.${extension} width must match source`)
      assert.equal(metadata.height, sourceMetadata.height, `${derivativeName}.${extension} height must match source`)
    }
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
