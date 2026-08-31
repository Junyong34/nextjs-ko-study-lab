import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      let count = 1

      const interval = setInterval(() => {
        if (count > 6) {
          const closeData = `data: ${JSON.stringify({
            status: 'completed',
            step: 6,
            message: '스트리밍이 정상 종료되었습니다.',
          })}\n\n`
          controller.enqueue(encoder.encode(closeData))
          clearInterval(interval)
          try {
            controller.close()
          } catch {}
          return
        }

        const data = `data: ${JSON.stringify({
          step: count,
          timestamp: new Date().toISOString().substring(11, 19),
          serverCpu: Math.floor(20 + ((count * 7) % 30)),
          memoryUsage: (256 + count * 12).toFixed(1),
          message: `실시간 시스템 텔레메트리 패킷 #${count} 수신`,
        })}\n\n`

        controller.enqueue(encoder.encode(data))
        count++
      }, 700)

      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        try {
          controller.close()
        } catch {}
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
