import { DETAIL_DELAY_MS } from './constants'
import type { Area, Check, ClickRun } from '../types'

/** C·D가 끝까지 도착한(측정이 끝난) 클릭만 판정에 쓴다. 이동 중인 클릭은 제외한다. */
const done = (r: ClickRun) => r.arrivals.C !== undefined && r.arrivals.D !== undefined
const at = (r: ClickRun, a: Area) => r.arrivals[a] ?? 0

/** 왕복 지연이 이보다 작으면 prefetch 유무의 차이가 측정에 드러나지 않는다(로컬 등). */
const MIN_RTT_VISIBLE_MS = 40

/**
 * 반복 측정(왕복 300ms를 건 로컬 production, 로드 2회 × 클릭 5종)에서 안정적이던 관계만 판정한다.
 * - 정적·캐시 영역(A·B)은 URL별·실시간 영역(C·D)보다 늦어도 지연의 40% 앞서 도착한다.
 * - 셸을 prefetch한 partial 라우트의 A는, 어떤 링크도 prefetch하지 않은 cold 라우트의 A보다 빠르다(지연이 보일 때만).
 * B2(짧은 stale)는 판정하지 않는다. 문서는 App Shell에서 제외된다고 하지만 B와 같은 시점에 도착해 확인하지 못했다.
 */
export function arrivalChecks(runs: ClickRun[]): { checks: Check[]; ready: boolean } {
  const finished = runs.filter(done)
  const partial = finished.filter((r) => r.route === 'partial' && r.link === 'default')
  const cold = finished.filter((r) => r.route === 'cold')
  const ready = partial.length > 0 && cold.length > 0
  if (finished.length === 0) return { checks: [], ready }

  const need = DETAIL_DELAY_MS * 0.4
  const gaps = finished.map((r) => Math.min(at(r, 'C'), at(r, 'D')) - Math.max(at(r, 'A'), at(r, 'B')))
  const minGap = Math.min(...gaps)
  const checks: Check[] = [
    {
      label: 'A·B가 C·D보다 먼저 도착',
      expected: `모든 클릭에서 C·D가 A·B보다 ${need}ms 이상 늦게 도착 (C·D는 ${DETAIL_DELAY_MS}ms 지연)`,
      actual: `가장 작은 차이 ${minGap}ms (클릭 ${finished.length}회)`,
      ok: minGap >= need,
    },
  ]

  if (ready) {
    const coldA = Math.min(...cold.map((r) => at(r, 'A')))
    const partialA = Math.max(...partial.map((r) => at(r, 'A')))
    const visible = coldA >= MIN_RTT_VISIBLE_MS
    checks.push({
      label: 'prefetch된 셸의 A vs prefetch 안 된 cold 라우트의 A',
      expected: 'partial 기본 링크의 A가 cold 링크의 A보다 빠름',
      actual: visible
        ? `partial 최대 ${partialA}ms < cold 최소 ${coldA}ms`
        : `cold ${coldA}ms — 이 환경은 네트워크 지연이 작아 차이가 드러나지 않아 비교를 생략`,
      ok: !visible || partialA < coldA,
      skipped: !visible,
    })
  }
  return { checks, ready }
}

/** 판정하지 않고 보여 주기만 하는 관찰: B2가 B와 얼마나 차이 나게 도착했는가 */
export function b2Note(runs: ClickRun[]): string | null {
  const r = [...runs].reverse().find((x) => x.arrivals.B !== undefined && x.arrivals.B2 !== undefined)
  return r ? `B2는 B와 ${Math.abs(at(r, 'B2') - at(r, 'B'))}ms 차이로 도착 (문서의 "App Shell 제외"는 이 측정에서 확인되지 않음)` : null
}
