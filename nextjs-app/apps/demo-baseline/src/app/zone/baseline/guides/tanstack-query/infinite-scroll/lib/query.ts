import { infiniteQueryOptions } from '@tanstack/react-query'
import type { ProductPage } from '../types'
import { endFetch, startFetch } from './observe'

export const BASE = '/zone/baseline/guides/tanstack-query/infinite-scroll'
export const PAGE_SIZE = 6
export const DELAY_MS = 700
/** 이 시간 안에 목록으로 돌아오면 캐시를 신선하다고 보고 다시 요청하지 않는다 */
export const STALE_TIME = 60_000

async function fetchPage(cursor: string | null, signal: AbortSignal): Promise<ProductPage> {
  const id = startFetch(cursor)
  const qs = new URLSearchParams({ limit: String(PAGE_SIZE), delay: String(DELAY_MS) })
  if (cursor) qs.set('cursor', cursor)
  try {
    // signal을 fetch에 넘겨야 TanStack Query가 쿼리를 취소할 때 실제 HTTP 요청도 중단된다.
    const res = await fetch(`${BASE}/api/products?${qs}`, { signal, cache: 'no-store' })
    if (!res.ok) throw new Error(`GET ${res.status}`)
    const page = (await res.json()) as ProductPage
    endFetch(id, { status: 'ok', pageNo: page.pageNo, cursorHits: page.cursorHits })
    return page
  } catch (e) {
    endFetch(id, { status: signal.aborted ? 'aborted' : 'error' })
    throw e
  }
}

export const productsQuery = infiniteQueryOptions({
  queryKey: ['guides-tanstack-infinite-scroll', 'products'],
  queryFn: ({ pageParam, signal }) => fetchPage(pageParam, signal),
  initialPageParam: null as string | null,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  staleTime: STALE_TIME,
})
