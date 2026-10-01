import { scenarioById } from '../expectations'
import type { Measurement } from '../types'

export interface Check {
  label: string
  ok: boolean
  detail: string
}

const same = (a: Record<string, string>, b: Record<string, string>) => {
  const ka = Object.keys(a).sort()
  const kb = Object.keys(b).sort()
  return ka.length === kb.length && ka.every((k, i) => k === kb[i] && a[k] === b[k])
}

/** 실측값(Measurement)을 시나리오 기대값과 항목별로 대조한다. 하드코딩된 통과는 없다. */
export function judge(m: Measurement): Check[] {
  const s = scenarioById(m.scenario)
  const checks: Check[] = [
    { label: '응답 상태', ok: m.status === s.expectStatus && m.responseType !== 'opaqueredirect', detail: `기대 ${s.expectStatus} / 실제 ${m.status} (${m.responseType}) — 3xx가 아니어야 rewrite` },
  ]
  if (s.expectDestination) {
    const p = m.probe
    checks.push(
      { label: '주소 유지', ok: m.responsePath === m.requestedPath, detail: `요청 ${m.requestedPath} / 응답 ${m.responsePath}` },
      { label: '렌더된 목적지', ok: p?.destination === s.expectDestination, detail: `기대 ${s.expectDestination} / 실제 ${p?.destination ?? '없음'}` },
      { label: '목적지 params', ok: !!p && same(p.params, s.expectParams(m.value)), detail: `기대 ${JSON.stringify(s.expectParams(m.value))} / 실제 ${JSON.stringify(p?.params ?? null)}` },
      { label: '목적지 searchParams', ok: !!p && same(p.searchParams, s.expectSearch(m.value)), detail: `기대 ${JSON.stringify(s.expectSearch(m.value))} / 실제 ${JSON.stringify(p?.searchParams ?? null)}` },
    )
  } else {
    checks.push({ label: '목적지 없음', ok: m.probe === null, detail: m.probe ? `목적지가 렌더됨: ${m.probe.destination}` : '목적지 페이지가 렌더되지 않음(규칙 미적용)' })
  }
  if (m.prediction) {
    const predictedRewrite = m.prediction === 'rewritten'
    // 직접 접근은 규칙이 적용되지 않으므로 searchParams에 source=rewrite가 없는지로 적용 여부를 실측한다.
    const applied = m.probe?.searchParams.source === 'rewrite'
    checks.push({ label: '예측', ok: predictedRewrite === applied, detail: `예측 ${predictedRewrite ? '적용됨' : '적용 안 됨'} / 실측 ${applied ? '적용됨(source=rewrite)' : '적용 안 됨'}` })
  }
  return checks
}
