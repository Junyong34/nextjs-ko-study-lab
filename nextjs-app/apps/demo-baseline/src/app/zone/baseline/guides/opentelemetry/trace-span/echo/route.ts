import { trace } from '@opentelemetry/api'

// 같은 앱 안의 "다른 서비스" 역할. 요청에 실려 온 traceparent 헤더와,
// Next가 그 헤더로 이어 붙인 활성 span의 traceId를 그대로 돌려준다.
export async function GET(request: Request) {
  const context = trace.getActiveSpan()?.spanContext()
  const body = {
    traceparent: request.headers.get('traceparent'),
    traceId: context?.traceId ?? null,
    spanId: context?.spanId ?? null,
    receivedAt: new Date().toISOString(),
  }
  return Response.json(body, {
    headers: { 'Cache-Control': 'no-store', 'x-demo-trace-id': body.traceId ?? 'none' },
  })
}
