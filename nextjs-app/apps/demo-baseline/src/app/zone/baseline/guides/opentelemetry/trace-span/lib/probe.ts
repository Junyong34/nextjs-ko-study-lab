import { SpanStatusCode, trace } from '@opentelemetry/api'
import { headers } from 'next/headers'
import type { EchoResult, ServerTraceProbe } from '../types'

const tracer = trace.getTracer('study-demo-trace-span')
export const DEMO_ROUTE = '/zone/baseline/guides/opentelemetry/trace-span'

/**
 * 서버 컴포넌트 렌더링 중에 실행된다.
 * 1) 지금 활성 span(Next가 만든 렌더링 span)의 traceId/spanId를 읽고
 * 2) startActiveSpan('demo.child')로 커스텀 span을 열어 그 안에서
 * 3) 같은 앱의 echo Route Handler를 fetch한다 — @vercel/otel fetch 계측이 traceparent 헤더를 붙인다.
 */
export async function runTraceProbe(): Promise<ServerTraceProbe> {
  const active = trace.getActiveSpan()?.spanContext()
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const echoUrl = `${proto}://${h.get('host')}${DEMO_ROUTE}/echo`
  const base = {
    traceId: active?.traceId ?? null,
    activeSpanId: active?.spanId ?? null,
    echoUrl,
    renderedAt: new Date().toISOString(),
  }

  return tracer.startActiveSpan('demo.child', async (span) => {
    const child = span.spanContext()
    const ids = { childSpanId: child.spanId, childTraceId: child.traceId }
    try {
      span.setAttribute('demo.echo_url', echoUrl)
      const res = await fetch(echoUrl, {
        cache: 'no-store',
        // Vercel 배포 URL이 아닌 곳에도 traceparent를 붙이도록 호출 단위로 명시한다.
        opentelemetry: { propagateContext: true },
      })
      if (!res.ok) throw new Error(`echo HTTP ${res.status}`)
      return { ...base, ...ids, echo: (await res.json()) as EchoResult, echoError: null }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      span.setStatus({ code: SpanStatusCode.ERROR, message })
      return { ...base, ...ids, echo: null, echoError: message }
    } finally {
      span.end()
    }
  })
}
