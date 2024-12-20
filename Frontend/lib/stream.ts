export async function* streamReader(response: Response) {
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('ReadableStream not supported in this browser.')
  }

  const decoder = new TextDecoder()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      yield decoder.decode(value, { stream: true })
    }
  } finally {
    reader.releaseLock()
  }
}
