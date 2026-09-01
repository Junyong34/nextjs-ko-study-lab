'use client'

import React, { useState, useTransition } from 'react'
import { MOCK_PRODUCTS, type Product } from '@study/demo-kit'

export function TanstackSsrDemo() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [isPending, startTransition] = useTransition()
  const [cacheHits, setCacheHits] = useState<number>(1)
  const [hydrationTime] = useState<number>(0) // 0ms initial SSR hydrate

  // Simulated Query Cache storage
  const [queryData, setQueryData] = useState<Product[]>(() => MOCK_PRODUCTS)

  const categories = [
    { id: 'all', label: '전체 상품' },
    { id: 'electronics', label: '전자기기' },
    { id: 'fashion', label: '패션/의류' },
    { id: 'books', label: '도서' },
  ]

  const filteredProducts =
    activeCategory === 'all'
      ? queryData
      : queryData.filter((p) => p.category === activeCategory)

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    startTransition(() => {
      setCacheHits((h) => h + 1)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 하이드레이션 상태 배너 */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-emerald-300 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/20 text-xs">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
            SSR Hydrated
          </span>
          <span className="font-bold text-emerald-950 dark:text-emerald-200">
            {'<'}HydrationBoundary{'>'} 서버 prefetch 데이터 즉시 하이드레이션
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-emerald-800 dark:text-emerald-300">
          <span>클라이언트 로딩 지연: <strong className="font-bold">{hydrationTime}ms (Zero Spinner)</strong></span>
          <span>캐시 적중 횟수: <strong className="font-bold">{cacheHits}회</strong></span>
        </div>
      </div>

      {/* 2. 카테고리 탭 필터 */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <span className="text-xs font-semibold text-zinc-500">카테고리:</span>
        <div className="flex gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`rounded px-3 py-1 text-xs font-medium transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 하이드레이션된 상품 그리드 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filteredProducts.slice(0, 4).map((p) => (
          <div
            key={p.id}
            className="rounded-lg border border-zinc-200 bg-white p-3 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold text-zinc-400">
                  {p.id.toUpperCase()}
                </span>
                <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {p.name}
                </h4>
              </div>
              <span className="font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                {p.price.toLocaleString()}원
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 line-clamp-1">{p.description}</p>
            <div className="flex items-center justify-between border-t border-zinc-100 pt-2 text-[10px] text-zinc-400 dark:border-zinc-900">
              <span>평점: ★ {p.rating} ({p.reviewCount}건)</span>
              <span className="text-emerald-600 font-semibold">재고 {p.stock}개 잔여</span>
            </div>
          </div>
        ))}
      </div>

      {/* 4. TanStack Query 캐시 내부 인스펙터 */}
      <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40 text-xs font-mono">
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          TanStack Query v5 Cache State:
        </span>
        <div className="mt-1 text-zinc-700 dark:text-zinc-300">
          queryKey: <code className="font-bold text-indigo-600">['products', '{activeCategory}']</code> | status:{' '}
          <span className="font-bold text-emerald-600">success</span> | isFetching:{' '}
          <span className="text-zinc-500">{isPending ? 'true' : 'false'}</span> | dataUpdatedAt:{' '}
          <span className="text-zinc-500">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
