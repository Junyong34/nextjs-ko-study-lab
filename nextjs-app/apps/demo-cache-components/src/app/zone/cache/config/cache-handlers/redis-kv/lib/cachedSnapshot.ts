import { cacheLife, cacheTag } from 'next/cache'
import type { CachedSnapshot, ServerInstance } from '../types'

// 태그는 zone 전역이라 데모 접두사를 붙인다 (apps/AGENTS.md 8항).
export const SNAPSHOT_TAG = 'config-cache-handlers-redis-kv:snapshot'

// 'use cache'는 cacheHandlers.default 핸들러에 저장된다.
// 이 앱은 cacheHandlers를 설정하지 않았으므로 Next.js 내장 메모리 LRU 핸들러가 이 프로세스 메모리에 보관한다.
export async function readCachedSnapshot(): Promise<CachedSnapshot> {
  'use cache'
  cacheTag(SNAPSHOT_TAG)
  // 관찰 도중 시간 만료로 바뀌지 않도록 긴 프로필을 쓴다. 교체는 [캐시 무효화]로만 일으킨다.
  cacheLife('hours')
  return {
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: Date.now(),
    generatedByPid: process.pid,
  }
}

/** 캐시 밖에서 매 요청 측정하는 현재 프로세스 정보 */
export function readServerInstance(): ServerInstance {
  return {
    pid: process.pid,
    startedAt: Math.round(Date.now() - process.uptime() * 1000),
    nodeEnv: process.env.NODE_ENV ?? 'unknown',
  }
}
