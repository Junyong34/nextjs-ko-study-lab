'use client'
import { useEffect, useState } from 'react'
import { useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { productsQuery } from '../lib/query'
import type { ProductPage } from '../types'

export interface CacheSnapshot {
  pages: number
  items: number
  total: number | null
  lastNextCursor: string | null
  hasNextPage: boolean
  isFetching: boolean
  /** 이 쿼리를 구독 중인 컴포넌트(observer) 수 — 목록이 언마운트되면 0 */
  observers: number
  dataUpdatedAt: number
}

/**
 * 쿼리를 새로 구독하지 않고 QueryCache 이벤트만 듣는다.
 * useInfiniteQuery를 또 부르면 observer가 늘어 "목록이 언마운트돼도 캐시만 남는다"는 관찰이 흐려진다.
 * 서버 렌더와 첫 클라이언트 렌더는 null로 같게 두고, 마운트 뒤에 값을 채운다.
 */
export function useCacheSnapshot(): CacheSnapshot | null {
  const qc = useQueryClient()
  const [snap, setSnap] = useState<CacheSnapshot | null>(null)

  useEffect(() => {
    const read = () => {
      const query = qc.getQueryCache().find<ProductPage, Error, InfiniteData<ProductPage>>({ queryKey: productsQuery.queryKey, exact: true })
      const data = query?.state.data
      const last = data?.pages[data.pages.length - 1]
      setSnap({
        pages: data?.pages.length ?? 0,
        items: data?.pages.reduce((n, p) => n + p.items.length, 0) ?? 0,
        total: last?.total ?? null,
        lastNextCursor: last?.nextCursor ?? null,
        hasNextPage: last ? last.nextCursor !== null : true,
        isFetching: query?.state.fetchStatus === 'fetching',
        observers: query?.getObserversCount() ?? 0,
        dataUpdatedAt: query?.state.dataUpdatedAt ?? 0,
      })
    }
    read()
    // QueryCache는 다른 컴포넌트가 렌더하는 도중(useInfiniteQuery가 쿼리를 만들 때)에도 'added' 이벤트를 보낸다.
    // 그 자리에서 setState하면 React가 렌더 중 업데이트 경고를 내므로 현재 작업이 끝난 뒤 읽는다.
    return qc.getQueryCache().subscribe(() => queueMicrotask(read))
  }, [qc])

  return snap
}
