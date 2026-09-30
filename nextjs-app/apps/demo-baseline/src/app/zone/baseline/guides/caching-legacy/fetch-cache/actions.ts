'use server'

import { headers } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { FETCH_CACHE_TAG, REVALIDATE_SECONDS, type FetchMode } from './types'

const SOURCE_PATH = '/zone/baseline/guides/caching-legacy/fetch-cache/api/source'

function fetchOptions(mode: FetchMode): RequestInit {
  switch (mode) {
    case 'force-cache':
      return { cache: 'force-cache', next: { tags: [FETCH_CACHE_TAG] } }
    case 'no-store':
      return { cache: 'no-store' }
    case 'revalidate':
      return { next: { revalidate: REVALIDATE_SECONDS, tags: [FETCH_CACHE_TAG] } }
    default:
      // 옵션 없음: Next.js 15+ 기본값은 캐시하지 않는다.
      return {}
  }
}

/** 원본 Route Handler를 서버에서 fetch한다. 캐시 옵션만 모드별로 다르다. */
export async function probeSource(mode: FetchMode) {
  const h = await headers()
  const host = h.get('host') ?? 'localhost:3001'
  const proto = h.get('x-forwarded-proto') ?? 'http'
  // 캐시 키는 URL을 포함하므로 mode를 쿼리에 넣어 모드별 캐시 항목을 분리한다.
  const url = `${proto}://${host}${SOURCE_PATH}?mode=${mode}`

  const started = performance.now()
  const res = await fetch(url, fetchOptions(mode))
  const elapsedMs = Math.round(performance.now() - started)
  const data = (await res.json()) as { sourceCount: number; generatedAt: string }
  return { mode, sourceCount: data.sourceCount, generatedAt: data.generatedAt, elapsedMs }
}

/** 태그가 붙은 Data Cache 항목(force-cache, revalidate)을 즉시 만료시킨다. */
export async function invalidateFetchCache() {
  revalidateTag(FETCH_CACHE_TAG, { expire: 0 })
}
