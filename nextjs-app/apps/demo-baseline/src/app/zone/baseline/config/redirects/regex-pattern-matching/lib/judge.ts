import { REGEX_DEMO_BASE } from '@/config/demo-next-config/redirects-regex'
import type { Prediction, ProbeOutcome, ProbeResult, RedirectCase } from '../types'

export const isProbeResult = (o: ProbeOutcome | null | undefined): o is ProbeResult => !!o && !('error' in o)

export function expectedLocation(c: RedirectCase): string | null {
  return c.expectLocation === null ? null : `${REGEX_DEMO_BASE}${c.expectLocation}`
}

/** 실측 응답(상태 코드 + Location)이 문서 기준 기대와 같은지 */
export function judgeCase(c: RedirectCase, r: ProbeResult): boolean {
  return r.status === c.expectStatus && r.location === expectedLocation(c)
}

export interface Summary {
  ran: number
  total: number
  measuredOk: number
  /** 측정이 기대와 다른 케이스 */
  failed: string[]
  /** 학습자가 한 예측 수와 그중 실제와 다른 케이스 */
  predicted: number
  wrongPrediction: string[]
  redirected: number
  notRedirected: number
}

export function summarize(
  cases: RedirectCase[],
  outcomes: Record<string, ProbeOutcome>,
  predictions: Record<string, Prediction>,
): Summary {
  const s: Summary = { ran: 0, total: cases.length, measuredOk: 0, failed: [], predicted: 0, wrongPrediction: [], redirected: 0, notRedirected: 0 }
  for (const c of cases) {
    const o = outcomes[c.id]
    if (!isProbeResult(o)) {
      if (o) { s.ran += 1; s.failed.push(c.id) }
      continue
    }
    s.ran += 1
    if (judgeCase(c, o)) s.measuredOk += 1
    else s.failed.push(c.id)
    if (o.status === 307 || o.status === 308) s.redirected += 1
    else s.notRedirected += 1
    const p = predictions[c.id]
    if (p != null) {
      s.predicted += 1
      if (p !== o.status) s.wrongPrediction.push(c.id)
    }
  }
  return s
}
