import type { ProbeResult } from '../types'
import { SCENARIOS, type Scenario } from './scenarios'

export interface Verdict {
  scenario: Scenario
  /** undefined 이면 아직 실행 전이다 */
  ok: boolean | undefined
  detail: string
}

/** 서버가 받아 되돌려 준 값 중 우리가 보낸 헤더에 해당하는 것 */
const received = (s: Scenario, r: ProbeResult) => (s.transport === 'fetch-forwarded' ? r.body?.forwardedHost : r.body?.host)

export function judgeOne(s: Scenario, r: ProbeResult | undefined): Verdict {
  if (!r) return { scenario: s, ok: undefined, detail: '실행 전' }
  if (r.error || !r.body) return { scenario: s, ok: false, detail: `요청 실패: ${r.error ?? '응답 없음'}` }
  const honored = received(s, r) === s.host
  const tenant = r.body.tenant?.id ?? null
  const ok = r.status === 200 && honored === s.expectHonored && tenant === s.expectTenant
  return {
    scenario: s,
    ok,
    detail: `보낸 ${Object.keys(r.sent)[0]}=${s.host} → 서버가 받은 값=${received(s, r) ?? '없음'} (${honored ? '반영됨' : '무시됨'}), 첫 라벨=${r.body.label ?? '없음'}, 테넌트=${tenant ?? '없음'}`,
  }
}

export const judgeAll = (results: Record<string, ProbeResult>) => SCENARIOS.map((s) => judgeOne(s, results[s.id]))

/** 하나라도 실패면 false, 전부 통과면 true, 하나도 실행 안 했거나 일부만 실행했으면 대기. */
export function overall(verdicts: Verdict[]): boolean | undefined {
  if (verdicts.some((v) => v.ok === false)) return false
  return verdicts.every((v) => v.ok === true) ? true : undefined
}
