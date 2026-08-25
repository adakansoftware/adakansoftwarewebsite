import { mkdir } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import sharp from "sharp"

const root = process.cwd()
const sourceDir = path.join(root, "public", "projects")
const outputDir = path.join(sourceDir, "optimized")
const images = [
  "sallihogullari-hafriyat-cover",
  "salihogullari-hafriyat-logo",
  "adakan-software-logo",
  "adakan-hafriyat-insaat-logo",
]

await mkdir(outputDir, { recursive: true })

for (const basename of images) {
  const source = path.join(sourceDir, `${basename}.png`)
  await sharp(source).rotate().avif({ quality: 52, effort: 6 }).toFile(path.join(outputDir, `${basename}.avif`))
  await sharp(source).rotate().webp({ quality: 72, effort: 6 }).toFile(path.join(outputDir, `${basename}.webp`))
}
