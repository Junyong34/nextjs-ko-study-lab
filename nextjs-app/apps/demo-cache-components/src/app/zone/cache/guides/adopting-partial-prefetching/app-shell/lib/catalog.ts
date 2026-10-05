import { cacheLife, cacheTag } from 'next/cache'
import { TAG_PREFIX } from './constants'

export interface Cached {
  id: string
  at: string
}

const stamp = (): Cached => ({
  id: Math.random().toString(36).slice(2, 8).toUpperCase(),
  at: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
})

/**
 * 영역 B — stale이 5분 이상인 캐시. App Shell에 들어가는 쪽이다(공식 문서의 조건).
 * id 같은 URL 데이터를 인자로 받지 않는다. URL에 의존하면 라우트 하나가 공유하는 셸에 넣을 수 없다.
 */
export async function getLongCached(): Promise<Cached> {
  'use cache'
  cacheLife('hours')
  cacheTag(`${TAG_PREFIX}long`)
  return stamp()
}

/**
 * 영역 B2 — stale 60초(30초~5분 구간). 프리렌더에는 들어가지만 App Shell에서는 제외된다는 공식 문서 서술을
 * 확인하기 위한 값이다. next.config를 건드리지 않도록 프로필 이름 대신 인라인 객체를 쓴다.
 */
export async function getShortStale(): Promise<Cached> {
  'use cache'
  cacheLife({ stale: 60, revalidate: 900, expire: 3600 })
  cacheTag(`${TAG_PREFIX}short`)
  return stamp()
}
