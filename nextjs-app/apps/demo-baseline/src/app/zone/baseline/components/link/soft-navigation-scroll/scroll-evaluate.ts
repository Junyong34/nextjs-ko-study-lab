import type { NavKind, NavRecord } from './types'

/** 서브픽셀 반올림 오차 허용치(px) */
const TOL = 2

const near = (a: number, b: number) => Math.abs(a - b) <= TOL

export interface RecordVerdict {
  /** 공식 문서 + 16.3.2 layout-router.js / segment-cache/navigation.js 기준 기대 결과 */
  expected: string
  pass: boolean
  /**
   * 이 기록이 scroll 동작 차이를 "판별"할 수 있는 조건이었는가.
   * 예: Page 상단이 이미 보이는 상태에서 누른 기본 링크는 유지가 정상이라 scroll={false}와 구분되지 않는다.
   */
  decisive: boolean
}

/** Next.js가 쓰는 판정과 같다: rect.top이 [scroll-padding-top(0), clientHeight] 안이면 "보임" */
function pageTopVisible(top: number, viewportH: number) {
  return top >= 0 && top <= viewportH
}

const hashOf = (url: string) => url.split('#')[1] ?? ''

/**
 * @param staleHash 직전에 "같은 해시 재클릭"으로 소비되지 않고 라우터 상태에 남은 해시.
 *   16.3.2는 이 경우 hashFragment를 비우지 않아, 다음 기본(scroll=true) Page 이동이
 *   새 Page의 같은 id로 스크롤한다 (실측으로 확인한 동작).
 */
export function evaluateRecord(
  r: NavRecord,
  baseTimeOrigin: number | null,
  staleHash: string | null,
): RecordVerdict {
  if (r.timedOut) {
    return { expected: '15초 안에 이동 완료', pass: false, decisive: false }
  }
  const sameDocument = baseTimeOrigin === null || r.timeOrigin === baseTimeOrigin
  const keptY = near(r.afterY, r.beforeY)

  const verdict = ((): RecordVerdict => {
    switch (r.kind) {
      case 'page-default': {
        if (staleHash) {
          return {
            expected: `남아 있던 해시 #${staleHash}로 새 Page에서 스크롤`,
            pass: r.landedOn === staleHash,
            decisive: false,
          }
        }
        if (pageTopVisible(r.pageTopBefore, r.viewportH)) {
          return { expected: 'Page 상단이 이미 뷰포트 안 → 위치 유지', pass: keptY, decisive: false }
        }
        return {
          expected: 'Page 상단이 뷰포트 밖 → Page 상단이 보이게 스크롤',
          pass: pageTopVisible(r.pageTopAfter, r.viewportH) && r.afterY < r.beforeY,
          decisive: true,
        }
      }
      case 'page-false':
        return {
          expected: 'scroll={false} → 위치 유지',
          pass: keptY,
          decisive: !pageTopVisible(r.pageTopBefore, r.viewportH),
        }
      case 'hash-default': {
        if (!r.hashChanged) {
          return { expected: '같은 해시 재클릭 → 해시 변경 없음, 스크롤 없음', pass: keptY, decisive: false }
        }
        const smt = r.scrollMarginTop ?? 0
        const target = hashOf(r.toUrl)
        return {
          expected: `#${target}이 scroll-margin-top(${smt}px) 위치로`,
          pass: r.landedOn === target,
          decisive: r.targetTopBefore !== null && !near(r.targetTopBefore, smt),
        }
      }
      case 'hash-false': {
        const smt = r.scrollMarginTop ?? 0
        return {
          expected: 'scroll={false} → URL 해시만 바뀌고 위치 유지',
          pass: keptY,
          decisive: r.hashChanged && r.targetTopBefore !== null && !near(r.targetTopBefore, smt),
        }
      }
    }
  })()

  if (!sameDocument) {
    return { ...verdict, expected: `${verdict.expected} + 문서 리로드 없음`, pass: false }
  }
  return verdict
}

/**
 * 기록을 순서대로 평가한다. 라우터 상태(남은 해시)는 이전 클릭에 따라 달라지므로 순서가 필요하다.
 * - 기본 해시 링크를 같은 해시로 재클릭 → 해시가 소비되지 않고 남음
 * - 기본 Page 이동 또는 해시가 바뀌는 기본 해시 이동 → 소비됨
 * - scroll={false} 이동은 스크롤을 하지 않으므로 남은 해시를 그대로 둔다
 */
export function evaluateSequence(records: NavRecord[], baseTimeOrigin: number | null) {
  let stale: string | null = null
  let docOrigin: number | null = null
  return records.map((r) => {
    if (r.timeOrigin !== docOrigin) {
      stale = null
      docOrigin = r.timeOrigin
    }
    const staleBefore: string | null = stale
    const verdict = evaluateRecord(r, baseTimeOrigin, staleBefore)
    if (r.kind === 'hash-default') stale = r.hashChanged ? null : hashOf(r.toUrl) || null
    else if (r.kind === 'page-default') stale = null
    return { record: r, verdict, staleBefore }
  })
}

export interface OverallVerdict {
  isMatched: boolean | undefined
  missingKinds: NavKind[]
}

/** 실패가 하나라도 있으면 false, 4종 모두 판별 가능한 기록이 모이면 true, 그 전에는 대기 */
export function evaluateAll(
  records: NavRecord[],
  baseTimeOrigin: number | null,
  kinds: NavKind[],
): OverallVerdict {
  const rows = evaluateSequence(records, baseTimeOrigin)
  const missingKinds = kinds.filter(
    (k) => !rows.some(({ record, verdict }) => record.kind === k && verdict.decisive && verdict.pass),
  )
  if (rows.some(({ verdict }) => !verdict.pass)) return { isMatched: false, missingKinds }
  return { isMatched: missingKinds.length === 0 ? true : undefined, missingKinds }
}
