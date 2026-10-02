'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { dealsQuery } from '../lib/deals-query'
import type { DealsVariant } from '../types'

const won = (n: number) => `${n.toLocaleString('ko-KR')}원`

/**
 * 오늘의 특가 목록. prefetched 라우트에서는 HydrationBoundary가 넣어 둔 캐시를 첫 렌더부터 읽고,
 * client-only 라우트에서는 캐시가 비어 있어 하이드레이션 뒤 브라우저가 api/deals를 요청한다.
 * 시각 문자열은 서버·브라우저 시간대가 달라 하이드레이션 불일치를 만들 수 있어 그리지 않는다.
 */
export function DealsList({ variant }: { variant: DealsVariant }) {
  const { data, isPending, isFetching, error } = useQuery(dealsQuery(variant))

  if (error) return <p className="p-3 text-xs text-rose-600">불러오지 못했습니다: {error.message}</p>
  if (isPending) {
    return (
      <div className="flex items-center gap-2 p-4 text-xs text-zinc-500" role="status">
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700" />
        오늘의 특가를 불러오는 중...
      </div>
    )
  }
  return (
    <div>
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {data.items.map((d) => (
          <li key={d.id} data-deal-row className="flex items-center justify-between px-3 py-2.5 text-sm">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{d.name}</span>
            <span className="text-xs">
              <span className="mr-2 font-bold text-rose-600">{d.discount}%</span>
              <span className="font-mono">{won(Math.round((d.price * (100 - d.discount)) / 100))}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="border-t border-zinc-200 px-3 py-1.5 text-[11px] text-zinc-500 dark:border-zinc-800">
        데이터 출처: {data.source === 'server-prefetch' ? '서버 컴포넌트 prefetch' : 'Route Handler (브라우저 요청)'} · 서버 읽기 #{data.readNo}
        {isFetching ? ' · 백그라운드 재요청 중' : ''}
      </div>
    </div>
  )
}
