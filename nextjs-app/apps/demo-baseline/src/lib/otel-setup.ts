// guides/opentelemetry/trace-span 데모가 소유한다. instrumentation.ts의 register()에서 nodejs 런타임에 한 번 호출된다.
// 외부 collector가 없으므로 span을 프로세스 메모리의 링버퍼에만 모은다. 전역 영향을 줄이기 위해
// (1) 데모 경로로 들어온 요청의 trace만 저장하고, (2) 버퍼는 최대 200개로 자르며,
// (3) @vercel/otel의 fetch/http 계측은 데모 경로 URL에만 적용한다(나머지 URL은 원래 fetch로 바로 통과).
import type { Context } from '@opentelemetry/api'
import type { ReadableSpan, Span, SpanProcessor } from '@opentelemetry/sdk-trace-base'
import { registerOTel } from '@vercel/otel'

export const OTEL_DEMO_PATH = '/guides/opentelemetry/trace-span'
export const OTEL_BUFFER_LIMIT = 200
const TRACKED_TRACE_LIMIT = 50
const ATTRIBUTE_LIMIT = 16

/** 링버퍼에 저장하는 span 요약. ReadableSpan 객체(resource 등 포함)를 붙잡지 않도록 값만 복사한다. */
export interface RecordedSpan {
  name: string
  traceId: string
  spanId: string
  parentSpanId: string | null
  /** 부모가 다른 프로세스(traceparent 헤더)에서 온 원격 컨텍스트인가 */
  parentIsRemote: boolean
  kind: number
  startMs: number
  durationMs: number
  statusCode: number
  attributes: Record<string, string | number | boolean>
}

export interface OtelDemoStore {
  installedAt: string
  limit: number
  spans: RecordedSpan[]
  /** 데모 경로 요청으로 시작된 traceId(최근 50개). 여기 없는 trace의 span은 저장하지 않는다. */
  trackedTraceIds: string[]
  droppedCount: number
}

declare global {
  // eslint-disable-next-line no-var
  var __guidesOtelTraceSpanInstalled: boolean | undefined
  // eslint-disable-next-line no-var
  var __guidesOtelTraceSpanStore: OtelDemoStore | undefined
}

const hrToMs = ([sec, nano]: [number, number]) => sec * 1000 + nano / 1e6

function pickAttributes(attributes: ReadableSpan['attributes']) {
  const picked: RecordedSpan['attributes'] = {}
  for (const [key, value] of Object.entries(attributes).slice(0, ATTRIBUTE_LIMIT)) {
    if (typeof value === 'string') picked[key] = value.slice(0, 200)
    else if (typeof value === 'number' || typeof value === 'boolean') picked[key] = value
  }
  return picked
}

class DemoRingBufferProcessor implements SpanProcessor {
  constructor(private readonly store: OtelDemoStore) {}

  onStart(span: Span, _parentContext: Context) {
    // Next가 만드는 요청 root span은 시작 시점에 http.target(요청 URL)을 갖는다.
    // traceparent로 이어진 요청(부모가 원격)도 같은 방식으로 판별한다.
    const target = span.attributes['http.target']
    const isEntry = !span.parentSpanContext || span.parentSpanContext.isRemote
    if (!isEntry || typeof target !== 'string' || !target.includes(OTEL_DEMO_PATH)) return
    // 링버퍼를 읽는 조회 요청(spans/route.ts) 자신의 trace는 저장하지 않는다.
    if (target.includes(`${OTEL_DEMO_PATH}/spans`)) return
    const { traceId } = span.spanContext()
    const tracked = this.store.trackedTraceIds
    if (tracked.includes(traceId)) return
    tracked.push(traceId)
    if (tracked.length > TRACKED_TRACE_LIMIT) tracked.shift()
  }

  onEnd(span: ReadableSpan) {
    const context = span.spanContext()
    if (!this.store.trackedTraceIds.includes(context.traceId)) return
    const spans = this.store.spans
    spans.push({
      name: span.name,
      traceId: context.traceId,
      spanId: context.spanId,
      parentSpanId: span.parentSpanContext?.spanId ?? null,
      parentIsRemote: span.parentSpanContext?.isRemote ?? false,
      kind: span.kind,
      startMs: Math.round(hrToMs(span.startTime)),
      durationMs: Math.round(hrToMs(span.duration) * 100) / 100,
      statusCode: span.status.code,
      attributes: pickAttributes(span.attributes),
    })
    if (spans.length > this.store.limit) {
      const overflow = spans.length - this.store.limit
      spans.splice(0, overflow)
      this.store.droppedCount += overflow
    }
  }

  forceFlush() {
    return Promise.resolve()
  }

  shutdown() {
    return Promise.resolve()
  }
}

export function setupOtel() {
  // dev에서 instrumentation이 다시 평가돼도 provider·fetch 패치를 두 번 설치하지 않는다.
  if (globalThis.__guidesOtelTraceSpanInstalled) return
  globalThis.__guidesOtelTraceSpanInstalled = true

  const store: OtelDemoStore = {
    installedAt: new Date().toISOString(),
    limit: OTEL_BUFFER_LIMIT,
    spans: [],
    trackedTraceIds: [],
    droppedCount: 0,
  }
  globalThis.__guidesOtelTraceSpanStore = store

  registerOTel({
    serviceName: 'study-demo-baseline',
    // 'auto'(OTLP·Vercel 연동 export)를 넣지 않는다. span은 이 프로세스의 링버퍼에만 남는다.
    spanProcessors: [new DemoRingBufferProcessor(store)],
    instrumentationConfig: {
      fetch: {
        // 데모 경로가 아닌 URL은 계측하지 않는다 — 다른 데모의 fetch/http 요청에 span·traceparent가 붙지 않는다.
        ignoreUrls: [/^(?!.*\/guides\/opentelemetry\/trace-span\/).*/],
      },
    },
  })
  console.info('[Instrumentation:otel] @vercel/otel 등록 완료 (링버퍼 최대 %d개)', OTEL_BUFFER_LIMIT)
}
