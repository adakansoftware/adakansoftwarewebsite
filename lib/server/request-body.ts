export type RequestTextWithinLimitResult =
  | { ok: true; text: string }
  | { ok: false; status: 413 }

export async function readRequestTextWithinLimit(
  request: Request,
  maxBytes: number,
): Promise<RequestTextWithinLimitResult> {
  if (!request.body) return { ok: true, text: "" }

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = value as Uint8Array
      totalBytes += chunk.byteLength
      if (totalBytes > maxBytes) {
        try {
          await reader.cancel()
        } catch {
          // The limit result remains authoritative if cancellation fails.
        }
        return { ok: false, status: 413 }
      }
      chunks.push(chunk)
    }
  } finally {
    reader.releaseLock()
  }

  const bytes = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }

  return { ok: true, text: new TextDecoder().decode(bytes) }
}
