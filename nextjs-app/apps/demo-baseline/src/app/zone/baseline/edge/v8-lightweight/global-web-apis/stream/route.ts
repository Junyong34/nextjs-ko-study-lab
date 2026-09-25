import { STREAM_CHUNKS, STREAM_INTERVAL_MS } from '../types'
import { splitCodePoints } from '../web-std'

export const runtime = 'edge'

type RawChunk = { seq: number; part: string }

// ReadableStream(pull + setTimeout) → TransformStream(객체 → NDJSON 줄) → TextEncoderStream(문자열 → 바이트)
// 청크마다 STREAM_INTERVAL_MS씩 기다렸다가 흘려보내므로, 응답이 끝나기 전에 브라우저가 앞 청크를 먼저 받는다.
export function GET(request: Request) {
  const input = new URL(request.url).searchParams.get('input') ?? ''
  const parts = splitCodePoints(input, STREAM_CHUNKS)
  const started = Date.now()
  let seq = 0

  const source = new ReadableStream<RawChunk>({
    async pull(controller) {
      if (seq === STREAM_CHUNKS) {
        controller.close()
        return
      }
      if (seq > 0) await new Promise((resolve) => setTimeout(resolve, STREAM_INTERVAL_MS))
      controller.enqueue({ seq, part: parts[seq] })
      seq += 1
    },
  })

  const toLine = new TransformStream<RawChunk, string>({
    transform(chunk, controller) {
      const line = {
        seq: chunk.seq,
        total: STREAM_CHUNKS,
        part: chunk.part,
        transformed: chunk.part.toUpperCase(),
        serverElapsedMs: Date.now() - started,
      }
      controller.enqueue(`${JSON.stringify(line)}\n`)
    },
  })

  const g = globalThis as typeof globalThis & { EdgeRuntime?: unknown }

  return new Response(source.pipeThrough(toLine).pipeThrough(new TextEncoderStream()), {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-Next-Runtime': process.env.NEXT_RUNTIME ?? 'unknown',
      'X-Edge-Runtime-Global': typeof g.EdgeRuntime,
    },
  })
}
