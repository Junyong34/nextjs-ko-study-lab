import type { Prediction, ProbeOutcome, ProbeResult, SlashCase } from '../types'

export const isProbeResult = (o: ProbeOutcome | null | undefined): o is ProbeResult => !!o && !('error' in o)

/** 실측 응답(상태 코드 + Location)이 기본값(false) 문서 기준과 같은지 */
export function judgeCase(c: SlashCase, r: ProbeResult): boolean {
  return r.status === c.expectStatus && r.location === c.expectLocation
}

export interface Summary {
  ran: number
  total: number
  measuredOk: number
  /** 측정이 기대와 다른 케이스 id */
  failed: string[]
  predicted: number
  wrongPrediction: string[]
  redirected: number
  /** 리다이렉트 없이 2xx로 응답한 수 */
  direct: number
}

export function summarize(
  cases: SlashCase[],
  outcomes: Record<string, ProbeOutcome>,
  predictions: Record<string, Prediction>,
): Summary {
  const s: Summary = { ran: 0, total: cases.length, measuredOk: 0, failed: [], predicted: 0, wrongPrediction: [], redirected: 0, direct: 0 }
  for (const c of cases) {
    const o = outcomes[c.id]
    if (!o) continue
    s.ran += 1
    if (!isProbeResult(o)) {
      s.failed.push(c.id)
      continue
    }
    if (judgeCase(c, o)) s.measuredOk += 1
    else s.failed.push(c.id)
    if (o.status >= 300 && o.status < 400) s.redirected += 1
    else if (o.status >= 200 && o.status < 300) s.direct += 1
    const p = predictions[c.id]
    if (p != null) {
      s.predicted += 1
      if (p !== o.status) s.wrongPrediction.push(c.id)
    }
  }
  return s
}

/** 측정 불일치·틀린 예측이 있으면 즉시 false, 전부 실행해 모두 맞으면 true, 그 전에는 대기(undefined) */
export function verdict(s: Summary): boolean | undefined {
  if (s.failed.length > 0 || s.wrongPrediction.length > 0) return false
  return s.ran === s.total ? true : undefined
}
