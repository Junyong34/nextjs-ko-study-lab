import type { EchoResult, RecordedSpan, Remote, ServerTraceProbe, SpansResponse } from './types'

export interface Check {
  label: string
  expected: string
  actual: string
  /** undefined = 아직 판정할 실측값이 없음 */
  ok: boolean | undefined
}

export interface Judgement {
  isMatched: boolean | undefined
  checks: Check[]
  description: string
}

const TRACE_ID = /^[0-9a-f]{32}$/
export const short = (id: string | null | undefined) => (id ? id.slice(0, 8) : '없음')
export const isValidTraceId = (id: string | null) => !!id && TRACE_ID.test(id) && !/^0+$/.test(id)
export const isFetchSpan = (s: RecordedSpan) => s.name.startsWith('fetch ')
export const isEchoRoot = (s: RecordedSpan) => s.name.startsWith('GET ') && s.name.endsWith('/echo') && s.parentIsRemote

/**
 * 서버 컴포넌트가 측정한 값(probe)과 링버퍼에서 읽은 span(spans), 브라우저 직접 호출 결과(direct)만으로 판정한다.
 * direct가 있으면 trace 전파 검증 대상이 브라우저 → echo 호출로 바뀌어 traceparent가 없으므로 불일치가 된다.
 */
export function judge(probe: ServerTraceProbe, spans: Remote<SpansResponse>, direct: Remote<EchoResult>): Judgement {
  const list = spans.status === 'ok' ? spans.data.spans : null
  const find = (id: string | null) => list?.find((s) => s.spanId === id)
  const child = find(probe.childSpanId)
  const parent = child ? find(child.parentSpanId) : undefined
  const fetchSpan = list?.find((s) => isFetchSpan(s) && s.parentSpanId === probe.childSpanId)
  const echoRoot = fetchSpan ? list?.find((s) => isEchoRoot(s) && s.parentSpanId === fetchSpan.spanId) : undefined
  const viaBrowser = direct.status === 'ok'
  const echo = viaBrowser ? direct.data : probe.echo
  const sentTraceId = echo?.traceparent?.split('-')[1] ?? null

  const checks: Check[] = [
    {
      label: '서버 컴포넌트의 활성 traceId',
      expected: '32자리 16진수(0이 아님)',
      actual: probe.traceId ?? '활성 span 없음(tracer provider 미등록)',
      ok: isValidTraceId(probe.traceId),
    },
    {
      label: 'demo.child의 부모',
      expected: `같은 trace, parentSpanId = 활성 span ${short(probe.activeSpanId)}`,
      actual: !list
        ? 'span 미수집'
        : child
          ? `parent ${short(child.parentSpanId)} (${parent?.name ?? '버퍼에 없음'})`
          : 'demo.child가 버퍼에 없음',
      ok: !list ? undefined : !!child && child.traceId === probe.traceId && child.parentSpanId === probe.activeSpanId,
    },
    {
      label: 'fetch span의 부모',
      expected: `parentSpanId = demo.child ${short(probe.childSpanId)}`,
      actual: !list ? 'span 미수집' : fetchSpan ? `${fetchSpan.name} → parent ${short(fetchSpan.parentSpanId)}` : '버퍼에 없음',
      ok: !list ? undefined : !!fetchSpan,
    },
    {
      label: viaBrowser ? 'trace 전파 (브라우저 → echo 직접 호출)' : 'trace 전파 (서버 fetch → echo)',
      expected: `traceparent에 페이지 traceId ${short(probe.traceId)}, echo의 traceId도 동일`,
      actual: echo
        ? `traceparent=${echo.traceparent ?? '없음'}, echo traceId=${short(echo.traceId)}` +
          (!viaBrowser && list ? `, echo root parent=${short(echoRoot?.parentSpanId)}(원격)` : '')
        : `echo 호출 실패: ${probe.echoError ?? (direct.status === 'error' ? direct.message : '')}`,
      ok:
        !!echo && sentTraceId === probe.traceId && echo.traceId === probe.traceId && (viaBrowser || !list || !!echoRoot),
    },
  ]

  if (checks.some((c) => c.ok === false)) {
    return {
      isMatched: false,
      checks,
      description: viaBrowser
        ? '브라우저의 fetch에는 서버의 trace 컨텍스트가 없어 traceparent가 붙지 않았고, echo는 새 trace를 시작했습니다. [서버 경유 결과로 되돌리기]로 비교해 보세요.'
        : probe.echo && !probe.echo.traceparent
          ? '서버 fetch에 traceparent가 붙지 않았습니다. next dev에서 서버 코드가 HMR되면 Next가 globalThis.fetch를 부팅 시점 값으로 되돌려 @vercel/otel의 fetch 계측이 빠집니다. dev 서버를 재시작한 뒤 다시 확인하세요.'
          : '기대와 다른 실측값입니다. 버퍼가 비워졌거나(초기화 직후) 계측이 등록되지 않았는지 확인하세요.',
    }
  }
  if (checks.some((c) => c.ok === undefined)) {
    return { isMatched: undefined, checks, description: '대기 중: [이 요청의 span 수집]을 눌러 링버퍼에서 이 페이지 요청의 span을 읽어 오세요.' }
  }
  return {
    isMatched: true,
    checks,
    description: 'demo.child는 Next의 렌더링 span 아래에, fetch는 demo.child 아래에, echo 요청은 traceparent로 같은 trace에 이어졌습니다.',
  }
}
