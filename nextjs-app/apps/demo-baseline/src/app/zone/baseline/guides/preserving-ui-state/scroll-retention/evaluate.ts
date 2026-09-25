import { NAV_METHODS } from './types'
import type { NavMethod, NavRecord } from './types'

/** 서브픽셀 반올림 오차 허용치(px) */
const TOL = 2
const near = (a: number, b: number) => Math.abs(a - b) <= TOL

/** Next.js layout-router와 같은 판정: rect.top이 [scroll-padding-top(0), clientHeight] 안이면 "보임" */
const pageTopVisible = (top: number, viewportH: number) => top >= 0 && top <= viewportH

export interface CheckResult {
  expected: string
  pass: boolean
}

export interface RecordVerdict {
  scroll: CheckResult
  panes: CheckResult
  server: CheckResult
  sameDocument: boolean
  pass: boolean
  /** 이 기록이 방법 간 차이를 판별할 수 있는 조건이었는가 (Page 상단이 뷰포트 밖 + 두 패널 모두 스크롤됨) */
  decisive: boolean
}

const isScrollFalse = (m: NavMethod) => NAV_METHODS.find((c) => c.method === m)?.scrollFalse ?? false

export function evaluateRecord(r: NavRecord, baseTimeOrigin: number | null): RecordVerdict {
  const topWasVisible = pageTopVisible(r.pageTopBefore, r.viewportH)

  const scroll: CheckResult = isScrollFalse(r.method)
    ? { expected: 'scroll=false → scrollY 전 = 후', pass: near(r.afterY, r.beforeY) }
    : topWasVisible
      ? { expected: 'Page 상단이 이미 보임 → scrollY 유지', pass: near(r.afterY, r.beforeY) }
      : {
          expected: 'Page 상단이 뷰포트 밖 → Page 상단이 보이게 스크롤',
          pass: pageTopVisible(r.pageTopAfter, r.viewportH) && r.afterY < r.beforeY,
        }

  const panes: CheckResult = {
    expected: '패널 A: 같은 DOM · scrollTop 유지 / 패널 B: 새 DOM · scrollTop 0',
    pass: !r.keptReplaced && near(r.keptAfter, r.keptBefore) && r.keyedReplaced && r.keyedAfter === 0,
  }

  const server: CheckResult = {
    expected: `서버가 ${r.toSearch}를 받아 새로 렌더링`,
    pass: r.receivedSearch === r.toSearch && r.renderIdAfter !== '' && r.renderIdAfter !== r.renderIdBefore,
  }

  const sameDocument = baseTimeOrigin === null || r.timeOrigin === baseTimeOrigin
  return {
    scroll,
    panes,
    server,
    sameDocument,
    pass: !r.timedOut && scroll.pass && panes.pass && server.pass && sameDocument,
    decisive: !topWasVisible && r.keptBefore > 0 && r.keyedBefore > 0,
  }
}

export interface OverallVerdict {
  isMatched: boolean | undefined
  missing: NavMethod[]
}

/** 실패가 하나라도 있으면 false, 5종 모두 판별 가능한 조건에서 통과한 기록이 모이면 true, 그 전에는 대기 */
export function evaluateAll(records: NavRecord[], baseTimeOrigin: number | null): OverallVerdict {
  const rows = records.map((r) => ({ r, v: evaluateRecord(r, baseTimeOrigin) }))
  const missing = NAV_METHODS.map((c) => c.method).filter(
    (m) => !rows.some(({ r, v }) => r.method === m && v.decisive && v.pass),
  )
  if (rows.some(({ v }) => !v.pass)) return { isMatched: false, missing }
  return { isMatched: missing.length === 0 ? true : undefined, missing }
}
