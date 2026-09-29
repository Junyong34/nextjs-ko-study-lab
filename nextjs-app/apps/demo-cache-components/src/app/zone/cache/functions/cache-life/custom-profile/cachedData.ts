import { cacheLife, cacheTag } from 'next/cache'

export interface CachedProfileSnapshot {
  cacheId: string
  generatedAt: string
}

function createSnapshot(): CachedProfileSnapshot {
  return {
    cacheId: Math.random().toString(36).slice(2, 8).toUpperCase(),
    generatedAt: new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    }),
  }
}

/** next.config.ts에 직접 정의한 커스텀 프로필에 바인딩된 실제 'use cache' 함수. */
export async function getCustomProfileSnapshot(): Promise<CachedProfileSnapshot> {
  'use cache'
  cacheTag('functions-cache-life-custom-profile:restock-alert')
  cacheLife('functions-cache-life-custom-profile:restock-alert')
  return createSnapshot()
}

/** 대비용: next.config.ts 수정 없이 바로 쓸 수 있는 내장 프리셋에 바인딩된 실제 'use cache' 함수. */
export async function getBuiltinCompareSnapshot(): Promise<CachedProfileSnapshot> {
  'use cache'
  cacheTag('functions-cache-life-custom-profile:minutes-compare')
  cacheLife('minutes')
  return createSnapshot()
}
