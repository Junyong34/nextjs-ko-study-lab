'use client'

import React, { useState, useTransition } from 'react'
import { MOCK_PRODUCTS, type Product } from '@study/demo-kit'

export function UnstableCacheDbDemo() {
  const [selectedProduct, setSelectedProduct] = useState('prod-001')
  const [productData, setProductData] = useState<Product>(() => MOCK_PRODUCTS[0])
  const [cacheStatus, setCacheStatus] = useState<'HIT' | 'MISS' | 'PURGED'>('HIT')
  const [latencyMs, setLatencyMs] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [cachedSkus, setCachedSkus] = useState<Set<string>>(new Set(['prod-001']))

  const handleFetch = (id: string) => {
    setSelectedProduct(id)
    startTransition(async () => {
      const isCached = cachedSkus.has(id)
      const start = performance.now()

      if (!isCached) {
        // Simulated PostgreSQL / Prisma DB Latency
        await new Promise((r) => setTimeout(r, 380))
        const found = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0]
        setProductData(found)
        setLatencyMs(Math.round(performance.now() - start))
        setCacheStatus('MISS')
        setCachedSkus((prev) => new Set([...prev, id]))
      } else {
        // Instant In-Memory / Data Cache Hit
        const found = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0]
        setProductData(found)
        setLatencyMs(Math.max(0, Math.round(performance.now() - start)))
        setCacheStatus('HIT')
      }
    })
  }

  const handlePurge = () => {
    startTransition(() => {
      setCachedSkus(new Set())
      setCacheStatus('PURGED')
      setLatencyMs(0)
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. 제어 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
            Next.js unstable_cache DB 쿼리 캐싱 및 태그 재검증 콘솔
          </h4>
          <p className="text-xs text-zinc-500">
            데이터베이스 호출 결과를 Data Cache에 보관하고 지정된 revalidate 주기와 태그로 무효화합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {MOCK_PRODUCTS.slice(0, 3).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleFetch(p.id)}
                disabled={isPending}
                className={`rounded px-2.5 py-1 text-xs font-semibold cursor-pointer transition ${
                  selectedProduct === p.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                {p.id.toUpperCase()} ({cachedSkus.has(p.id) ? 'HIT' : 'MISS'})
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handlePurge}
            disabled={isPending}
            className="rounded bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700 cursor-pointer shadow-2xs"
          >
            태그 무효화 (revalidateTag)
          </button>
        </div>
      </div>

      {/* 2. 캐시 상태 및 제품 카드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-700 dark:text-zinc-300">Data Cache 적중 상태</span>
            <span
              className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold text-white ${
                cacheStatus === 'HIT'
                  ? 'bg-emerald-600'
                  : cacheStatus === 'MISS'
                    ? 'bg-amber-600'
                    : 'bg-rose-600'
              }`}
            >
              {cacheStatus === 'HIT' ? 'CACHE HIT' : cacheStatus === 'MISS' ? 'DB MISS' : 'TAG PURGED'}
            </span>
          </div>

          <div className="rounded bg-white p-3 shadow-2xs dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 space-y-1">
            <div className="flex justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <span>{productData.name}</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">
                {productData.price.toLocaleString()}원
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 line-clamp-1">{productData.description}</div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-1">
            <span>응답 시간: <strong className="text-zinc-800 dark:text-zinc-200">{isPending ? '쿼리 중...' : `${latencyMs}ms`}</strong></span>
            <span>재고: {productData.stock}개 잔여</span>
          </div>
        </div>

        {/* 3. unstable_cache 시그니처 인스펙터 */}
        <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1.5">
          <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">
            unstable_cache 함수 정의:
          </div>
          <div className="space-y-1 text-[11px]">
            <div className="text-blue-300">const getCachedProduct = unstable_cache(</div>
            <div className="pl-3 text-zinc-400">async (id) =&gt; db.products.findUnique({'{ where: { id } }'}),</div>
            <div className="pl-3 text-emerald-400">['ecommerce-product-detail'],</div>
            <div className="pl-3 text-amber-300">{'{'} revalidate: 3600, tags: ['products', 'product-{selectedProduct}'] {'}'}</div>
            <div className="text-blue-300">)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
