import type { RecordedSpan } from '@/lib/otel-setup'

export type { RecordedSpan }

/** echo/route.ts가 돌려주는 값: 요청에 실려 온 traceparent 헤더와 핸들러 안의 활성 span 컨텍스트 */
export interface EchoResult {
  traceparent: string | null
  traceId: string | null
  spanId: string | null
  receivedAt: string
}

/** 서버 컴포넌트(page.tsx)가 렌더링 중에 측정한 값. 요청마다 새로 만들어진다. */
export interface ServerTraceProbe {
  /** trace.getActiveSpan()으로 읽은, 서버 컴포넌트가 실행되는 동안의 활성 span */
  traceId: string | null
  activeSpanId: string | null
  /** tracer.startActiveSpan('demo.child')로 만든 커스텀 span */
  childSpanId: string | null
  childTraceId: string | null
  echoUrl: string
  echo: EchoResult | null
  echoError: string | null
  renderedAt: string
}

/** spans/route.ts GET 응답 */
export interface SpansResponse {
  installed: boolean
  limit: number
  total: number
  droppedCount: number
  trackedTraceCount: number
  spans: RecordedSpan[]
}

export type Remote<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ok'; data: T }
  | { status: 'error'; message: string }
