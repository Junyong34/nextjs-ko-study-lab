'use client'

import React from 'react'
import type { RevalidatePathResult } from '../types'

interface RevalidatePathSyncDemoProps {
  result: RevalidatePathResult | null
  isPending: boolean
  onRevalidate: () => void
}

export function RevalidatePathSyncDemo({ result, isPending, onRevalidate }: RevalidatePathSyncDemoProps) {
  const handleRevalidate = onRevalidate

  return (
    <div className="space-y-4">
      {/* 1. 상단 상태 바 및 액션 버튼 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <span>상태: </span>
          <span className="font-mono text-zinc-900 dark:text-zinc-100">
            {result?.message || '대기 중'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleRevalidate}
          disabled={isPending}
          className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
        >
          {isPending ? '캐시 퍼지 중...' : "revalidatePath('/shop') 실행"}
        </button>
      </div>

      {/* 2. 라우트 내 세그먼트 캐시 상태 시각화 */}
      <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800 font-sans">
          <span className="font-bold text-zinc-800 dark:text-zinc-200">
            /shop 라우트 트리 세그먼트 캐시 현황
          </span>
          <span className="text-[11px] text-zinc-400">
            {result ? `갱신 시각: ${result.timestamp}` : '초기 캐시 유지 중'}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(result?.segments || [
            { name: '상단 글로벌 배너 (ShopBanner)', type: 'component', cachedTime: '초기 빌드 시점', version: 1 },
            { name: '카테고리 필터 사이드바 (ShopSidebar)', type: 'component', cachedTime: '초기 빌드 시점', version: 1 },
            { name: '메인 상품 그리드 (ProductGrid)', type: 'page', cachedTime: '초기 빌드 시점', version: 1 },
            { name: '추천 알고리즘 피드 (RecommendationSlot)', type: 'component', cachedTime: '초기 빌드 시점', version: 1 },
          ]).map((seg, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded bg-zinc-50 p-2.5 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
            >
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">{seg.name}</div>
                <div className="text-[11px] text-zinc-500">타입: {seg.type}</div>
              </div>
              <div className="text-right">
                <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                  v{seg.version}
                </span>
                <div className="text-[10px] text-zinc-400 mt-0.5">{seg.cachedTime}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
