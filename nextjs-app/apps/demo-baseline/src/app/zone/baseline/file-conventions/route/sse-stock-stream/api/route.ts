import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const initialStocks: Record<string, number> = {
    'PROD-001': 45,
    'PROD-002': 14,
    'PROD-003': 88,
  }

  let timer: NodeJS.Timeout | null = null

  const stream = new ReadableStream({
    start(controller) {
      // 1. 초기 상태 전송
      const initMessage = `data: ${JSON.stringify({
        type: 'INIT',
        stocks: initialStocks,
        timestamp: new Date().toISOString(),
        message: 'SSE 재고 스트리밍 연결 수립',
      })}\n\n`
      controller.enqueue(encoder.encode(initMessage))

      // 2. 주기적 실시간 재고 변동 틱 전송
      let count = 0
      timer = setInterval(() => {
        if (request.signal.aborted || count >= 30) {
          if (timer) clearInterval(timer)
          try {
            controller.close()
          } catch {
            // ignore if already closed
          }
          return
        }

        count++
        const productIds = Object.keys(initialStocks)
        const targetId = productIds[Math.floor(Math.random() * productIds.length)]
        const delta = Math.random() > 0.3 ? -1 : 1
        initialStocks[targetId] = Math.max(0, initialStocks[targetId] + delta)

        const tickMessage = `data: ${JSON.stringify({
          type: 'TICK',
          tickNumber: count,
          productId: targetId,
          newStock: initialStocks[targetId],
          delta,
          timestamp: new Date().toISOString(),
        })}\n\n`

        try {
          controller.enqueue(encoder.encode(tickMessage))
        } catch {
          if (timer) clearInterval(timer)
        }
      }, 1200)
    },
    cancel() {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'x-accel-buffering': 'no',
    },
  })
}
