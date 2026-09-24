import type { LoadingSkeletonVerdict, NavMeasurement } from './types'

/** 클릭 → 첫 시각 피드백(스켈레톤 또는 최종 콘텐츠)까지 걸린 시간 */
export function firstFeedbackMs(m: NavMeasurement): number | null {
  const first = m.skeletonAt ?? m.contentAt
  return first === null ? null : Math.round(first - m.clickAt)
}

/** 클릭 → 최종 콘텐츠까지 걸린 시간 */
export function totalMs(m: NavMeasurement): number | null {
  return m.contentAt === null ? null : Math.round(m.contentAt - m.clickAt)
}

function checkWith(m: NavMeasurement, reasons: string[]) {
  if (m.skeletonAt === null) {
    reasons.push('loading.tsx 있음: 스켈레톤 DOM이 관측되지 않았습니다.')
    return false
  }
  if (m.contentAt === null || m.skeletonAt >= m.contentAt) {
    reasons.push('loading.tsx 있음: 스켈레톤이 최종 콘텐츠보다 먼저 나타나지 않았습니다.')
    return false
  }
  return true
}

function checkWithout(m: NavMeasurement, reasons: string[]) {
  if (m.skeletonAt !== null) {
    reasons.push('loading.tsx 없음: 스켈레톤이 관측됐습니다(경계가 없어야 합니다).')
    return false
  }
  return true
}

function checkServerWait(m: NavMeasurement, reasons: string[]) {
  const total = totalMs(m)
  if (total === null || m.serverMs === null) return false
  if (total < m.serverMs) {
    reasons.push(`${m.variant}: 전체 완료(${total}ms)가 서버 대기(${m.serverMs}ms)보다 짧습니다.`)
    return false
  }
  return true
}

/**
 * 두 경로를 각각 1회 이상 측정한 뒤 판정한다.
 * - 있음: 스켈레톤 → 최종 콘텐츠 순서, 없음: 스켈레톤 없이 최종 콘텐츠만
 * - 두 경로 모두 전체 완료 시간 ≥ 서버 대기 (서버 await는 줄지 않는다)
 * - 첫 피드백: 있음 < 없음 (체감 즉시 전환)
 * - production에서만: 클릭 전 prefetch 응답 크기가 있음 > 없음 (loading 경계까지 포함)
 */
export function evaluate(
  withRun: NavMeasurement | undefined,
  withoutRun: NavMeasurement | undefined,
): LoadingSkeletonVerdict {
  if (!withRun || !withoutRun) {
    return { isMatched: undefined, reasons: ['두 경로를 각각 한 번 이상 클릭해 측정해 주세요.'] }
  }
  if (withRun.contentAt === null || withoutRun.contentAt === null) {
    return { isMatched: undefined, reasons: ['최종 콘텐츠 도착을 기다리는 중입니다.'] }
  }

  const reasons: string[] = []
  const okWith = checkWith(withRun, reasons)
  const okWithout = checkWithout(withoutRun, reasons)
  const okServer = checkServerWait(withRun, reasons) && checkServerWait(withoutRun, reasons)

  const fbWith = firstFeedbackMs(withRun)
  const fbWithout = firstFeedbackMs(withoutRun)
  const okFeedback = fbWith !== null && fbWithout !== null && fbWith < fbWithout
  if (!okFeedback) {
    reasons.push(`첫 피드백: 있음(${fbWith}ms)이 없음(${fbWithout}ms)보다 빠르지 않습니다.`)
  }

  let okPrefetch = true
  if (withRun.mode === 'production' && withoutRun.mode === 'production') {
    // Next 16은 두 링크 모두 경로 트리를 prefetch한다. 차이는 내용: loading.tsx가 있으면
    // "layout부터 loading 경계까지"의 세그먼트 데이터가 더 실려 오므로 응답이 더 크다.
    okPrefetch = withRun.prefetchBeforeClick >= 1 && withRun.prefetchBytes > withoutRun.prefetchBytes
    if (!okPrefetch) {
      reasons.push(
        `prefetch: 있음 ${withRun.prefetchBeforeClick}건/${withRun.prefetchBytes}B, 없음 ${withoutRun.prefetchBeforeClick}건/${withoutRun.prefetchBytes}B (있음 쪽이 더 커야 함)`,
      )
    }
  }

  const isMatched = okWith && okWithout && okServer && okFeedback && okPrefetch
  if (isMatched) reasons.push('모든 조건을 실측값이 만족했습니다.')
  return { isMatched, reasons }
}
