import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_DIR = path.resolve(__dirname, '..')
const BASELINE_ROOT = path.join(BASE_DIR, 'apps/demo-baseline/src/app/zone/baseline')
const CACHE_ROOT = path.join(BASE_DIR, 'apps/demo-cache-components/src/app/zone/cache')

function writeComponent(filePath, code) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, code, 'utf8')
}

// 1. Guides: SWR Polling
writeComponent(
  path.join(BASELINE_ROOT, 'guides/swr-polling/components/SwrPollingClient.tsx'),
  `'use client'
import React, { useState, useEffect } from 'react'
import { MOCK_ORDERS, DeliveryTracker, type Order } from '@study/demo-kit'

export function SwrPollingClient() {
  const [order, setOrder] = useState<Order>(MOCK_ORDERS[0])
  const [pollCount, setPollCount] = useState(1)
  const [isPolling, setIsPolling] = useState(true)

  useEffect(() => {
    if (!isPolling) return
    const interval = setInterval(() => {
      setPollCount(c => c + 1)
      // simulate status transition after some polls
      setOrder(prev => {
        if (prev.status === 'PAID') return { ...prev, status: 'PREPARING', statusName: '상품 준비중' }
        if (prev.status === 'PREPARING') return { ...prev, status: 'SHIPPING', statusName: '배송 중' }
        return prev
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [isPolling])

  const handleManualMutate = (newStatus: Order['status'], name: string) => {
    setOrder(prev => ({ ...prev, status: newStatus, statusName: name }))
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">🚚 SWR 실시간 주문/배송 위치 자동 폴링 (useSWR Polling)</h4>
          <p className="text-zinc-500 text-[11px]">3초 주기로 배송 API를 자동 폴링하며, mutate()로 즉각적인 상태 갱신을 실행합니다.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-zinc-500">폴링 횟수: {pollCount}회</span>
          <button
            type="button"
            onClick={() => setIsPolling(!isPolling)}
            className={\`rounded px-2.5 py-1 text-[11px] font-bold cursor-pointer \${
              isPolling ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-zinc-200 text-zinc-700'
            }\`}
          >
            {isPolling ? '● 자동 폴링 중' : '일시정지'}
          </button>
        </div>
      </div>

      <DeliveryTracker order={order} />

      <div className="flex items-center justify-between rounded bg-zinc-50 p-2.5 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
        <span className="text-zinc-500 font-medium">SWR mutate() 강제 상태 변경:</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => handleManualMutate('SHIPPING', '배송 중')}
            className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-700 cursor-pointer"
          >
            배송 출발
          </button>
          <button
            type="button"
            onClick={() => handleManualMutate('DELIVERED', '배송 완료')}
            className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 cursor-pointer"
          >
            배송 완료 (mutate)
          </button>
        </div>
      </div>
    </div>
  )
}
`
)

// 2. Guides: Streaming
writeComponent(
  path.join(BASELINE_ROOT, 'guides/streaming-nested/components/NestedStreamingClient.tsx'),
  `'use client'
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
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">🌊 상품 상세 점진적 Suspense 청크 스트리밍</h4>
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
            ⏳ AI 맞춤 연관 상품 스트리밍 로딩 중...
          </div>
        )}
      </div>

      {/* 3. 구매 후기 (1.8s 지연) */}
      <div className="rounded border border-zinc-200 p-3 dark:border-zinc-800">
        <span className="rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">청크 3 (Suspense 스트리밍 ~1.8s)</span>
        {loadedSections.includes('reviews') ? (
          <div className="mt-2 space-y-1.5 font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
            <div>⭐ 5.0 - "배송도 빠르고 키감 최고입니다!" (구매자: 박*우)</div>
            <div>⭐ 5.0 - "맥북과 윈도우 블루투스 전환 아주 부드러워요." (구매자: 최*혁)</div>
          </div>
        ) : (
          <div className="py-4 text-center text-zinc-400 animate-pulse font-mono">
            ⏳ 342건의 실시간 구매 후기 스트리밍 중...
          </div>
        )}
      </div>
    </div>
  )
}
`
)

console.log('[enhance] Remaining components enhanced successfully!')
