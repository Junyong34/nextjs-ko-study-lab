import type { CartUserOrGuest } from './types'

// 'use cache: private' 함수 본문이 실제로 실행된 횟수를 사용자별로 센다.
// 함수 본문이 실행됐다는 것은 캐시 miss라는 뜻이고, 실행되지 않은 렌더는 캐시 hit이다.
const globalStore = globalThis as unknown as { __privateCacheUserRuns?: Map<string, number> }
const runs = (globalStore.__privateCacheUserRuns ??= new Map<string, number>())

export function bumpRun(userId: CartUserOrGuest): number {
  const next = (runs.get(userId) ?? 0) + 1
  runs.set(userId, next)
  return next
}

export function readRuns(userId: CartUserOrGuest): number {
  return runs.get(userId) ?? 0
}

export function resetRuns() {
  runs.clear()
}
