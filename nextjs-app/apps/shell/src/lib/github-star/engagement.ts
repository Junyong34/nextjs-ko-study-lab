import { GITHUB_STAR_STORAGE_VERSION } from './constants.ts'
import type { GithubStarConfig, StarEngagementRecord } from './types.ts'

export function createEmptyEngagementRecord(now: string): StarEngagementRecord {
  return {
    version: GITHUB_STAR_STORAGE_VERSION,
    visitCount: 1,
    activeMs: 0,
    firstSeenAt: now,
    lastActiveTickAt: now,
    promptShownAt: null,
    dismissedAt: null,
    dismissedForever: false,
    clickedThroughAt: null,
  }
}

/** 노출 대상 여부 판단 (순수 함수) */
export function isEligibleForStarPrompt(
  record: StarEngagementRecord,
  config: GithubStarConfig,
  nowIso: string,
): boolean {
  // 1. 영구 미노출 조건
  if (record.dismissedForever || record.clickedThroughAt !== null) {
    return false
  }

  // 2. X 닫기 쿨다운 체크
  if (record.dismissedAt !== null) {
    const dismissedTime = new Date(record.dismissedAt).getTime()
    const nowTime = new Date(nowIso).getTime()
    const cooldownMs = config.cooldownDays * 24 * 60 * 60 * 1000
    if (nowTime - dismissedTime < cooldownMs) {
      return false
    }
  }

  // 3. 참여도 조건 충족 여부 (시간 OR 방문횟수)
  const hasEnoughTime = record.activeMs >= config.minActiveMs
  const hasEnoughVisits = record.visitCount >= config.minVisitCount

  return hasEnoughTime || hasEnoughVisits
}

/** 활성 시간 누적 */
export function addActiveDuration(
  record: StarEngagementRecord,
  durationMs: number,
  nowIso: string,
): StarEngagementRecord {
  return {
    ...record,
    activeMs: record.activeMs + Math.max(0, durationMs),
    lastActiveTickAt: nowIso,
  }
}

/** 방문 횟수 증가 */
export function incrementVisitCount(
  record: StarEngagementRecord,
  nowIso: string,
): StarEngagementRecord {
  return {
    ...record,
    visitCount: record.visitCount + 1,
    lastActiveTickAt: nowIso,
  }
}

/** 프롬프트 첫 노출 시각 기록 */
export function recordPromptShown(
  record: StarEngagementRecord,
  nowIso: string,
): StarEngagementRecord {
  if (record.promptShownAt) return record
  return { ...record, promptShownAt: nowIso }
}

/** Star 링크 클릭 처리 (영구 미노출) */
export function recordStarClickThrough(
  record: StarEngagementRecord,
  nowIso: string,
): StarEngagementRecord {
  return { ...record, clickedThroughAt: nowIso }
}

/** 닫기(X) 처리 (쿨다운 적용) */
export function recordDismiss(
  record: StarEngagementRecord,
  nowIso: string,
): StarEngagementRecord {
  return { ...record, dismissedAt: nowIso }
}

/** 다시 보지 않기 처리 (영구 미노출) */
export function recordDismissForever(
  record: StarEngagementRecord,
  _nowIso: string,
): StarEngagementRecord {
  return { ...record, dismissedForever: true }
}
