'use client'
import React, { useState } from 'react'
import { MOCK_PRODUCTS, ProductCard } from '@study/demo-kit'

export function NestedStreamingClient() {
  const [loadedSections, setLoadedSections] = useState<string[]>(['header', 'product-main'])

  const handleStartStreaming = () => {
    setLoadedSections(['header'])
    setTimeout(() => setLoadedSections(prev => [...prev, 'product-main']), 300)
    setTimeout(() => setLoadedSections(prev => [...prev, 'recommendations']), 1000)
    setTimeout(() => setLoadedSections(prev => [...prev, 'reviews']), 1800)
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">상품 상세 점진적 Suspense 청크 스트리밍</h4>
          <p className="text-zinc-500 text-[11px]">핵심 상품 정보는 즉시 표시하고, 느린 추천 상품과 리뷰는 점진적으로 스트리밍 렌더링합니다.</p>
        </div>
        <button
          type="button"
          onClick={handleStartStreaming}
          className="rounded bg-blue-600 px-3 py-1.5 font-bold text-white shadow-2xs hover:bg-blue-700 cursor-pointer"
        >
          스트리밍 재시뮬레이션
        </button>
      </div>

      {/* 1. 기본 상품 정보 */}
      <div className="rounded border border-blue-200 bg-blue-50/40 p-3 dark:border-blue-900/60 dark:bg-blue-950/20">
        <span className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">청크 1 (0ms 즉시 반환)</span>
        <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-1">{MOCK_PRODUCTS[0].name}</div>
        <div className="text-blue-600 dark:text-blue-400 font-extrabold font-mono text-base">{MOCK_PRODUCTS[0].price.toLocaleString()}원</div>
      </div>

      {/* 2. 연관 추천 상품 (1.0s 지연) */}
      <div className="rounded border border-zinc-200 p-3 dark:border-zinc-800">
        <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">청크 2 (Suspense 스트리밍 ~1.0s)</span>
        {loadedSections.includes('recommendations') ? (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {MOCK_PRODUCTS.slice(1, 3).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-zinc-400 animate-pulse font-mono">
            AI 맞춤 연관 상품 스트리밍 로딩 중...
          </div>
        )}
      </div>

      {/* 3. 구매 후기 (1.8s 지연) */}
      <div className="rounded border border-zinc-200 p-3 dark:border-zinc-800">
        <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">청크 3 (Suspense 스트리밍 ~1.8s)</span>
        {loadedSections.includes('reviews') ? (
          <div className="mt-2 space-y-1.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
            <div>5.0 - "배송도 빠르고 키감 최고입니다!" (구매자: 박*우)</div>
            <div>5.0 - "맥북과 윈도우 블루투스 전환 아주 부드러워요." (구매자: 최*혁)</div>
          </div>
        ) : (
          <div className="py-4 text-center text-zinc-400 animate-pulse font-mono">
            342건의 실시간 구매 후기 스트리밍 중...
          </div>
        )}
      </div>
    </div>
  )
}
