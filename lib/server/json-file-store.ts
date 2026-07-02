import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname } from "node:path"

let writeQueue = Promise.resolve()

async function ensureParentDirectory(filePath: string) {
  await mkdir(dirname(filePath), { recursive: true })
}

export async function readJsonFile<T>(filePath: string, fallback: T) {
  try {
    const content = await readFile(filePath, "utf8")
    return JSON.parse(content) as T
  } catch {
    return fallback
  }
}

export function writeJsonFile(filePath: string, value: unknown) {
  writeQueue = writeQueue.then(async () => {
    await ensureParentDirectory(filePath)
    await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8")
  })

  return writeQueue
}
