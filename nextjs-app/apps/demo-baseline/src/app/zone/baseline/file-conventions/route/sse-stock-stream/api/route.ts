import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

const TICK_INTERVAL_MS = 2000
const MAX_TICKS = 20

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const initialStocks: Record<string, number> = {
    'PROD-001': 45,
    'PROD-002': 14,
    'PROD-003': 88,
  }

  let timer: NodeJS.Timeout | null = null
  let closed = false

  const stream = new ReadableStream({
    start(controller) {
      // request.signal의 'abort' 이벤트로 클라이언트 연결 해제를 즉시 감지해 정리한다.
      const stop = (reason: string) => {
        if (closed) return
        closed = true
        if (timer) {
          clearInterval(timer)
          timer = null
        }
        console.log(`[sse-stock-stream] 연결 정리: ${reason} @ ${new Date().toISOString()}`)
        try {
          controller.close()
        } catch {
          // 이미 닫힌 스트림이면 무시
        }
      }

      console.log(`[sse-stock-stream] 연결 수립 @ ${new Date().toISOString()}`)

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
          stop('청크 enqueue 실패')
          return
        }

        if (count >= MAX_TICKS) {
          stop('최대 틱 수 도달')
        }
      }, TICK_INTERVAL_MS)

      request.signal.addEventListener('abort', () => stop('클라이언트 연결 해제(abort)'))
    },
    cancel(reason) {
      if (closed) return
      closed = true
      if (timer) {
        clearInterval(timer)
        timer = null
      }
      console.log(`[sse-stock-stream] stream.cancel() 호출됨: ${reason ?? '소비자 취소'} @ ${new Date().toISOString()}`)
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
