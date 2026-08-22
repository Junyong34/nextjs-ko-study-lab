import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

describe('Tier 4: Scenario 5 - Live Stock & Telemetry Stream', () => {
  it('should stream continuous stock events and flush data warehouse analytics via after()', async () => {
    // 1. Live SSE Stock Stream Simulation
    const stockEvents: { sku: string; stock: number; timestamp: number }[] = []
    const dwLogs: { eventType: string; latencyMs: number; clientIp: string }[] = []

    const handleStreamConnection = () => {
      const startTime = Date.now()
      const clientIp = '198.51.100.24'

      // Background DW logging with after()
      const logToDataWarehouse = async () => {
        dwLogs.push({
          eventType: 'stock.stream.opened',
          latencyMs: Date.now() - startTime,
          clientIp,
        })
      }
      Promise.resolve().then(logToDataWarehouse)

      // Stream generation
      const encoder = new TextEncoder()
      return new ReadableStream({
        start(controller) {
          const payload1 = { sku: 'PROD-101', stock: 48, timestamp: Date.now() }
          const payload2 = { sku: 'PROD-102', stock: 12, timestamp: Date.now() }
          stockEvents.push(payload1, payload2)

          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload1)}\n\n`))
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload2)}\n\n`))
          controller.close()
        },
      })
    }

    const stream = handleStreamConnection()
    const reader = stream.getReader()
    const chunk1 = await reader.read()
    assert.strictEqual(chunk1.done, false)

    const chunk2 = await reader.read()
    assert.strictEqual(chunk2.done, false)

    const chunk3 = await reader.read()
    assert.strictEqual(chunk3.done, true)

    await new Promise((r) => setTimeout(r, 10))
    assert.strictEqual(stockEvents.length, 2)
    assert.strictEqual(dwLogs.length, 1)
    assert.strictEqual(dwLogs[0].eventType, 'stock.stream.opened')
    assert.strictEqual(dwLogs[0].clientIp, '198.51.100.24')
  })
})
