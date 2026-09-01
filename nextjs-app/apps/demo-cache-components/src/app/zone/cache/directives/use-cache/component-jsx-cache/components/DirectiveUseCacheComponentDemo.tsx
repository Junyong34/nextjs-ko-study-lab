'use client'

import React, { useState, useTransition } from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'

export function DirectiveUseCacheComponentDemo() {
  const [category, setCategory] = useState<string>('all')
  const [cachedRenderTimes, setCachedRenderTimes] = useState<Record<string, string>>({
    all: '2026-08-22 13:00:00 (RSC Payload Cache Hit)',
  })
  const [isPending, startTransition] = useTransition()

  const categories = [
    { id: 'all', label: '종합 베스트' },
    { id: 'electronics', label: '전자기기' },
    { id: 'fashion', label: '패션/의류' },
    { id: 'books', label: '도서 베스트' },
  ]

  const getRankedItems = (cat: string) => {
    const list = cat === 'all' ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter((p) => p.category === cat)
    return [...list].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount).slice(0, 3)
  }

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat)
    if (!cachedRenderTimes[newCat]) {
      startTransition(() => {
        setCachedRenderTimes((prev) => ({
          ...prev,
          [newCat]: `${new Date().toLocaleTimeString()} (최초 렌더 직렬화 저장)`,
        }))
      })
    }
  }

  const handlePurgeTag = () => {
    startTransition(() => {
      setCachedRenderTimes({
        [category]: `${new Date().toLocaleTimeString()} (태그 revalidation 직렬화 갱신)`,
      })
    })
  }

  const rankedItems = getRankedItems(category)
  const currentRenderTimestamp = cachedRenderTimes[category] || `${new Date().toLocaleTimeString()} (렌더링 됨)`

  return (
    <div className="space-y-4">
      {/* 1. 카테고리 필터 및 캐시 무효화 제어 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">랭킹 카테고리:</span>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCategoryChange(c.id)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                category === c.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-xs'
                  : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePurgeTag}
          className="rounded bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700 cursor-pointer shadow-2xs"
        >
          🔄 컴포넌트 캐시 태그 무효화
        </button>
      </div>

      {/* 2. 캐시된 JSX 트리 렌더러 (<BestSellerRankingHero />) */}
      <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 p-4 shadow-sm dark:border-indigo-950 dark:from-indigo-950/20 dark:via-zinc-950 dark:to-purple-950/20 space-y-3">
        <div className="flex items-center justify-between border-b border-indigo-100 pb-2 dark:border-indigo-900/50">
          <div className="flex items-center gap-2">
            <span className="rounded bg-indigo-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
              JSX CACHE HIT
            </span>
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
              {'<'}BestSellerRankingHero category="{category}" /{'>'}
            </span>
          </div>
          <span className="font-mono text-[11px] text-indigo-700 dark:text-indigo-300">
            JSX 렌더 타임스탬프: <strong>{currentRenderTimestamp}</strong>
          </span>
        </div>

        {/* 랭킹 1위 ~ 3위 카드 리스트 */}
        <div className="space-y-2">
          {rankedItems.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200/80 bg-white p-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-bold ${
                    index === 0
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : index === 1
                        ? 'bg-zinc-300 text-zinc-900'
                        : 'bg-amber-700 text-white'
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {item.name}
                  </h4>
                  <div className="text-[10px] text-zinc-500">
                    ★ {item.rating} (구매후기 {item.reviewCount}건) | {item.categoryName}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                  {item.price.toLocaleString()}원
                </span>
                <div className="text-[10px] text-emerald-600 font-semibold">인기 상품</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. RSC 컴포넌트 레벨 직렬화 해설 */}
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40 text-xs font-mono text-zinc-600 dark:text-zinc-400">
        <div>• <strong>컴포넌트 루트 'use cache'</strong>: 함수 내부의 원시 데이터뿐만 아니라 컴포넌트가 반환하는 전체 JSX 엘리먼트 가상 DOM 트리를 사전 직렬화(RSC Payload)하여 캐시합니다.</div>
        <div className="mt-1">• <strong>클라이언트 재방문 시</strong>: 서버 컴포넌트 실행을 건너뛰고 0ms 만에 완성된 UI 조각을 즉시 주입합니다.</div>
      </div>
    </div>
  )
}
