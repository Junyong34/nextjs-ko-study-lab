'use client'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { markSettled, recordAction, resetObserved } from '../lib/observe'
import { BASE, productsQuery, STALE_TIME } from '../lib/query'

/** 진입 후 이 시간 동안 추가 요청이 있는지 지켜본 뒤 판정한다 */
const ENTRY_SETTLE_MS = 900
export const BURST_CALLS = 5

export function useProductFeed() {
  const qc = useQueryClient()
  const q = useInfiniteQuery(productsQuery)

  // 마운트 순간 캐시에 이미 데이터가 있었는지. 렌더에 쓰지 않고 effect에서 기록만 한다.
  const [entry] = useState(() => {
    const st = qc.getQueryState(productsQuery.queryKey)
    return {
      hadData: st?.data !== undefined,
      pages: st?.data?.pages.length ?? 0,
      stale: st?.data !== undefined && Date.now() - st.dataUpdatedAt > STALE_TIME,
      mountedAt: performance.now(),
    }
  })
  const recorded = useRef(false)
  useEffect(() => {
    // StrictMode의 effect 재실행에도 진입 기록은 마운트당 한 번만 남긴다.
    if (recorded.current) return
    recorded.current = true
    const a = recordAction(entry.hadData ? 'reentry' : 'first-entry', {
      pagesAtStart: entry.pages,
      hadDataOnFirstRender: entry.hadData,
      staleAtEntry: entry.stale,
    }, entry.mountedAt)
    setTimeout(() => markSettled(a.id), ENTRY_SETTLE_MS)
  }, [entry])

  const pages = q.data?.pages.length ?? 0

  /** 센티널이 보일 때 — 권장 가드: 다음 페이지가 있고, 지금 받는 중이 아닐 때만 */
  const loadNextFromSentinel = () => {
    if (!q.hasNextPage || q.isFetchingNextPage) return
    recordAction('scroll', { pagesAtStart: pages })
    void q.fetchNextPage()
  }

  /** 스크롤 이벤트가 몰린 상황: 가드 없이 같은 틱에 fetchNextPage를 5번 부른다 */
  const burst = (cancelRefetch: boolean) => {
    if (!q.hasNextPage || q.isFetching) return
    recordAction(cancelRefetch ? 'burst-default' : 'burst-guarded', { pagesAtStart: pages })
    for (let i = 0; i < BURST_CALLS; i++) {
      void q.fetchNextPage(cancelRefetch ? undefined : { cancelRefetch: false }).catch(() => {})
    }
  }

  const reset = async () => {
    await fetch(`${BASE}/api/products`, { method: 'DELETE' })
    resetObserved()
    recordAction('first-entry', { pagesAtStart: 0, hadDataOnFirstRender: false, staleAtEntry: false })
    // 초기 상태로 되돌리고, 화면에 구독자가 있으므로 첫 페이지만 다시 받는다.
    await qc.resetQueries({ queryKey: productsQuery.queryKey })
  }

  return { q, pages, loadNextFromSentinel, burst, reset }
}
