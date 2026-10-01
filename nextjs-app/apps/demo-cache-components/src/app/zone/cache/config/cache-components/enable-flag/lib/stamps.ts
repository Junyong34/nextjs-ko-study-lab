import { cacheLife, cacheTag } from 'next/cache'
import { connection } from 'next/server'
import { REQUEST_DELAY_MS } from './delay'

export { REQUEST_DELAY_MS }

/** cacheTag는 앱 전역이라 데모 접두사를 붙인다 (apps/AGENTS.md 8항) */
export const SHELL_STAMP_TAG = 'config-cache-components-enable-flag:shell-stamp'

export interface Stamp {
  id: string
  at: string
}

function makeStamp(): Stamp {
  return {
    id: Math.random().toString(36).slice(2, 8).toUpperCase(),
    at: new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    }),
  }
}

/**
 * 'use cache' 함수 — cacheComponents: true일 때만 쓸 수 있는 지시어다.
 * 결과가 캐시되므로 Suspense 밖에서 await해도 정적 셸에 포함된다.
 */
export async function getCachedStamp(): Promise<Stamp> {
  'use cache'
  // 'minutes'(revalidate 60초)는 측정 사이에 백그라운드 재계산이 끼어 ID가 바뀔 수 있어 더 긴 프리셋을 쓴다
  cacheLife('hours')
  cacheTag(SHELL_STAMP_TAG)
  return makeStamp()
}

/**
 * 캐시하지 않는 요청 시점 데이터 — connection()으로 요청을 기다린 뒤 값을 만든다.
 * 이 함수를 쓰는 컴포넌트는 반드시 <Suspense> 안에 있어야 한다 (밖이면 빌드가 실패한다).
 */
export async function getRequestStamp(): Promise<Stamp> {
  await connection()
  await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS))
  return makeStamp()
}
