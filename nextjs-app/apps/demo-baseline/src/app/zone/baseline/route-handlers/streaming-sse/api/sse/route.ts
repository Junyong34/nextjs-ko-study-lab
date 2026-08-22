export const dynamic = 'force-dynamic'

export async function GET() {
  const encoder = new TextEncoder()

  // ReadableStream을 사용한 Server-Sent Events 실시간 푸시
  const stream = new ReadableStream({
    async start(controller) {
      let count = 1

      const interval = setInterval(() => {
        if (count > 6) {
          const closeData = `data: ${JSON.stringify({
            status: 'completed',
            message: '스트리밍이 정상 종료되었습니다.',
          })}\n\n`
          controller.enqueue(encoder.encode(closeData))
          clearInterval(interval)
          controller.close()
          return
        }

        const data = `data: ${JSON.stringify({
          step: count,
          timestamp: new Date().toLocaleTimeString('ko-KR'),
          serverCpu: Math.floor(20 + Math.random() * 30),
          memoryUsage: (256 + count * 12).toFixed(1),
          message: `실시간 시스템 텔레메트리 패킷 #${count} 수신`,
        })}\n\n`

        controller.enqueue(encoder.encode(data))
        count++
      }, 700)
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
