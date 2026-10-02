import type { RecordedSpan, ServerTraceProbe } from '../types'
import { isEchoRoot, isFetchSpan, short } from '../expectations'

/** 부모 spanId를 따라 깊이 우선으로 펼친다. 원격 부모(traceparent)도 같은 버퍼에 있으면 이어 그린다. */
function withDepth(spans: RecordedSpan[]) {
  const ids = new Set(spans.map((s) => s.spanId))
  const sorted = [...spans].sort((a, b) => a.startMs - b.startMs)
  const rows: { span: RecordedSpan; depth: number }[] = []
  const visit = (parentId: string | null, depth: number) => {
    for (const span of sorted) {
      const parent = span.parentSpanId && ids.has(span.parentSpanId) ? span.parentSpanId : null
      if (parent !== parentId || depth > 20) continue
      rows.push({ span, depth })
      visit(span.spanId, depth + 1)
    }
  }
  visit(null, 0)
  return rows
}

function roleOf(s: RecordedSpan, probe: ServerTraceProbe) {
  if (s.spanId === probe.activeSpanId) return '서버 컴포넌트의 활성 span'
  if (s.spanId === probe.childSpanId) return 'tracer.startActiveSpan'
  if (isFetchSpan(s)) return '@vercel/otel fetch 계측'
  if (isEchoRoot(s)) return 'traceparent로 이어진 요청'
  return null
}

export function SpanTree({ spans, probe }: { spans: RecordedSpan[]; probe: ServerTraceProbe }) {
  if (spans.length === 0) {
    return <p className="text-xs text-zinc-500">이 traceId의 span이 버퍼에 없습니다(초기화했거나 200개 상한을 넘겨 밀려났을 수 있습니다).</p>
  }
  return (
    <ol className="space-y-0.5 font-mono text-[11px]">
      {withDepth(spans).map(({ span, depth }) => {
        const role = roleOf(span, probe)
        return (
          <li
            key={span.spanId}
            style={{ paddingLeft: `${depth * 14}px` }}
            className={role ? 'font-semibold text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'}
          >
            <span className="text-zinc-400">{depth > 0 ? '└ ' : ''}</span>
            {span.name}
            <span className="ml-2 text-zinc-400">
              {span.durationMs}ms · span {short(span.spanId)} · parent {short(span.parentSpanId)}
              {span.parentIsRemote ? '(원격)' : ''}
            </span>
            {role && <span className="ml-2 rounded bg-zinc-200 px-1 text-[10px] dark:bg-zinc-800">{role}</span>}
          </li>
        )
      })}
    </ol>
  )
}
