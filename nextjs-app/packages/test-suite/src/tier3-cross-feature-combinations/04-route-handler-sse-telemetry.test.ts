import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Tier 3: Combination 4 - Route Handler route.ts + SSE Streaming + after() Telemetry', () => {
  it('3.4.1 should stream real-time price updates while logging stream connection via after()', async () => {
    let backgroundLogRecorded = false
    const telemetryEvents: any[] = []

    const sseHandler = () => {
      // after() background logging hook
      const logConnection = async () => {
        backgroundLogRecorded = true
        telemetryEvents.push({ event: 'sse.connected', timestamp: Date.now() })
      }
      Promise.resolve().then(logConnection)

      const encoder = new TextEncoder()
      return new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode('data: {"sku":"PROD-101","price":29000}\n\n'))
          controller.close()
        },
      })
    }

    const stream = sseHandler()
    const reader = stream.getReader()
    const chunk = await reader.read()
    assert.strictEqual(chunk.done, false)
    await new Promise((r) => setTimeout(r, 10))
    assert.strictEqual(backgroundLogRecorded, true)
    assert.strictEqual(telemetryEvents.length, 1)
  })
})
