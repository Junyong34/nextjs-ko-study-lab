'use client'

import React, { useState, useTransition } from 'react'
import { MOCK_PRODUCTS, type Product } from '@study/demo-kit'

export function DirectiveUseCacheFunctionDemo() {
  const [selectedId, setSelectedId] = useState<string>('prod-001')
  const [productData, setProductData] = useState<Product | null>(() => MOCK_PRODUCTS[0])
  const [latencyMs, setLatencyMs] = useState<number>(0)
  const [cacheStatus, setCacheStatus] = useState<'HIT' | 'MISS' | 'REVALIDATED'>('HIT')
  const [isPending, startTransition] = useTransition()
  const [cachedIds, setCachedIds] = useState<Set<string>>(new Set(['prod-001']))

  // Simulated 'use cache' function invocation
  const fetchProductCached = (id: string) => {
    setSelectedId(id)
    startTransition(async () => {
      const isCached = cachedIds.has(id)
      const startTime = performance.now()

      if (!isCached) {
        // Simulated DB latency for Cache Miss
        await new Promise((r) => setTimeout(r, 450))
        const found = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0]
        const endTime = performance.now()
        setProductData(found)
        setLatencyMs(Math.round(endTime - startTime))
        setCacheStatus('MISS')
        setCachedIds((prev) => new Set([...prev, id]))
      } else {
        // Instant response for Cache Hit (<1ms)
        const found = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0]
        const endTime = performance.now()
        setProductData(found)
        setLatencyMs(Math.max(0, Math.round(endTime - startTime)))
        setCacheStatus('HIT')
      }
    })
  }

  const handleRevalidateTag = () => {
    startTransition(async () => {
      // Invalidate cache tag
      setCachedIds(new Set())
      setCacheStatus('REVALIDATED')
      setLatencyMs(0)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 제어 옵션 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">조회 대상 상품:</span>
          {MOCK_PRODUCTS.slice(0, 3).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => fetchProductCached(p.id)}
              disabled={isPending}
              className={`rounded px-2.5 py-1 font-mono text-[11px] font-medium transition cursor-pointer ${
                selectedId === p.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                  : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {p.id.toUpperCase()} ({cachedIds.has(p.id) ? 'HIT' : 'MISS'})
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleRevalidateTag}
          disabled={isPending}
          className="rounded bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700 cursor-pointer shadow-2xs"
        >
          🔄 revalidateTag('product-detail') 실행
        </button>
      </div>

      {/* 2. 캐시 성능 및 응답 지연 시간 패널 */}
      <div className="flex items-center justify-between rounded-lg border border-emerald-300 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/20 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold text-white ${
              cacheStatus === 'HIT'
                ? 'bg-emerald-600'
                : cacheStatus === 'MISS'
                  ? 'bg-amber-600'
                  : 'bg-rose-600'
            }`}
          >
            {cacheStatus === 'HIT'
              ? 'CACHE HIT'
              : cacheStatus === 'MISS'
                ? 'CACHE MISS'
                : 'TAG PURGED'}
          </span>
          <span className="font-bold text-emerald-950 dark:text-emerald-200 font-mono">
            async function getProductDetail('{selectedId}')
          </span>
        </div>
        <div className="font-mono text-xs">
          응답 지연 시간:{' '}
          <strong
            className={`font-bold ${
              latencyMs < 20 ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'
            }`}
          >
            {isPending ? '조회 중...' : `${latencyMs}ms`}
          </strong>
        </div>
      </div>

      {/* 3. 캐시된 결과 데이터 카드 */}
      {productData && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold text-zinc-400">
                {productData.id.toUpperCase()}
              </span>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {productData.name}
              </h4>
            </div>
            <span className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
              {productData.price.toLocaleString()}원
            </span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{productData.description}</p>
          <div className="flex items-center justify-between border-t border-zinc-100 pt-2 text-[11px] text-zinc-500 dark:border-zinc-900 font-mono">
            <span>태그: cacheTag('product-detail', '{productData.id}')</span>
            <span>재고: {productData.stock}개 잔여</span>
          </div>
        </div>
      )}
    </div>
  )
}
