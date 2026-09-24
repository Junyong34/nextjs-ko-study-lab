import { ORIGIN_LATENCY_MS, PROFILES } from './tags'
import type { MeasureRun } from './types'

/** 1회차 요청이 무효화 후 expire 시간 안에 도착하면 stale 값(SWR), 지나서 도착하면 새 값(블로킹)을 기대한다 */
export function expectsStaleFirst(run: Pick<MeasureRun, 'profileId' | 'delaySec'>) {
  return run.delaySec < PROFILES[run.profileId].expireSeconds
}

/** 캐시 함수 호출이 원본 지연만큼 걸렸다면 그 요청은 재계산을 기다린 것이다 */
export function waitedForRecompute(durationMs: number) {
  return durationMs >= ORIGIN_LATENCY_MS * 0.8
}

export function evaluate(run: MeasureRun) {
  const { before, invalidation, first, second } = run
  if (run.phase !== 'done' || run.error || !before || !invalidation || !first || !second) return null
  const target = invalidation.sourceAfter.version
  const firstStale = first.cached.cacheId === before.cached.cacheId && first.cached.version < target
  const firstFresh = first.cached.version === target && first.cached.generatedAtMs >= invalidation.sourceAfter.updatedAtMs
  const secondFresh = second.cached.version === target
  const secondReused = second.cached.cacheId === first.cached.cacheId
  const expectStale = expectsStaleFirst(run)
  const matched = expectStale ? firstStale && secondFresh : firstFresh && secondFresh && secondReused
  return { target, firstStale, firstFresh, secondFresh, secondReused, expectStale, matched }
}
