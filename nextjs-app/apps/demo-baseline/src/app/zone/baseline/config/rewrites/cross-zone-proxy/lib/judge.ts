import { scenarioById } from '../expectations'
import type { Measurement } from '../types'

export interface Check {
  label: string
  ok: boolean
  detail: string
}

const zoneLabel = (z: string | null) => (z === 'cache' ? 'cache zone' : z === 'baseline' ? 'baseline zone' : '판정 불가')

/** 실측값(Measurement)을 시나리오 기대값과 항목별로 대조한다. 하드코딩된 통과는 없다. */
export function judge(m: Measurement): Check[] {
  const s = scenarioById(m.scenario)
  const checks: Check[] = [
    { label: '응답 상태', ok: m.status === s.expectStatus, detail: `기대 ${s.expectStatus} / 실제 ${m.status}` },
    { label: '리다이렉트 없음', ok: !m.redirected, detail: `response.redirected = ${m.redirected}` },
    { label: '주소 유지', ok: m.responsePath === m.requestedPath, detail: `요청 ${m.requestedPath} / 응답 ${m.responsePath}` },
    { label: '응답한 zone', ok: m.evidence.zone === s.expectZone, detail: `기대 ${zoneLabel(s.expectZone)} / 실제 ${zoneLabel(m.evidence.zone)} — ${m.evidence.basis}` },
  ]
  if (s.kind === 'html') {
    // cache zone은 poweredByHeader 기본값(true), baseline은 false라 이 헤더 유무도 zone을 가리킨다.
    const expectHeader = s.expectZone === 'cache'
    checks.push({
      label: 'X-Powered-By 헤더',
      ok: (m.poweredBy !== null) === expectHeader,
      detail: `기대 ${expectHeader ? '있음' : '없음'} / 실제 ${m.poweredBy ?? '없음'}`,
    })
  } else {
    checks.push({ label: 'Content-Type', ok: m.contentType.startsWith('image/png'), detail: `기대 image/png / 실제 ${m.contentType || '없음'}` })
  }
  if (m.prediction) {
    checks.push({
      label: '예측',
      ok: m.prediction === m.evidence.zone,
      detail: `예측 ${zoneLabel(m.prediction)} / 실측 ${zoneLabel(m.evidence.zone)}`,
    })
  }
  return checks
}
