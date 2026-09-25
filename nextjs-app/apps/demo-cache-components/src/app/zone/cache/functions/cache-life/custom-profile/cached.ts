import { cacheLife, cacheTag } from 'next/cache'
import { CUSTOM_PROFILE_NAME } from './types'
import type { BindingMode, CacheSnapshot } from './types'

// 서버 프로세스 메모리의 실제 실행 카운터. 'use cache' 본문이 "실제로 실행될 때만" 증가한다.
const execCount: Record<BindingMode, number> = { custom: 0, default: 0 }

function snapshot(mode: BindingMode): CacheSnapshot {
  execCount[mode] += 1
  return {
    mode,
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: Date.now(),
    execNo: execCount[mode],
  }
}

/**
 * next.config.ts의 cacheLife 커스텀 프로필에 바인딩된 속보 배너 조회.
 * revalidate 4초 / expire 20초 — 짧은 실습 시간 안에 재계산이 관측되도록 설계했다.
 */
export async function getBreakingNewsCustom(): Promise<CacheSnapshot> {
  'use cache'
  cacheTag('functions-cache-life-custom-profile:breaking-news')
  cacheLife(CUSTOM_PROFILE_NAME)
  return snapshot('custom')
}

/**
 * 비교 대조군. cacheLife()를 호출하지 않으므로 내장 default 프로필
 * (stale 5분 · revalidate 15분 · expire 없음)이 암묵적으로 적용된다.
 * 커스텀 프로필과 같은 실습 시간 동안 cacheId가 바뀌지 않아야 "정상"이다.
 */
export async function getBreakingNewsDefault(): Promise<CacheSnapshot> {
  'use cache'
  cacheTag('functions-cache-life-custom-profile:breaking-news-default')
  return snapshot('default')
}
