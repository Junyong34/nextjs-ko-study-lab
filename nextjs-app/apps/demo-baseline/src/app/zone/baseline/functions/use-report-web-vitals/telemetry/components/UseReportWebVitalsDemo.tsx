'use client'
import React, { useCallback, useState } from 'react'
import { useReportWebVitals } from 'next/web-vitals'
import { ProductCard, MOCK_PRODUCTS, DemoResetButton } from '@study/demo-kit'
import { VerificationFooter } from './VerificationFooter'
import type { WebVitalLogEntry, WebVitalMetric } from '../types'

const DEMO_PRODUCTS = MOCK_PRODUCTS.slice(0, 3)

const RATING_DOT: Record<string, string> = {
  good: 'bg-emerald-500',
  'needs-improvement': 'bg-amber-500',
  poor: 'bg-rose-500',
}

/** 지표 이름별 최신 1건만 유지 — dev StrictMode 이중 렌더로 같은 지표가 두 번 도착해도 목록이 늘어나지 않게 한다 */
function upsertByName(prev: Record<string, WebVitalLogEntry>, metric: WebVitalMetric) {
  return { ...prev, [metric.name]: { metric, receivedAt: Date.now() } }
}

export function UseReportWebVitalsDemo() {
  const [logsByName, setLogsByName] = useState<Record<string, WebVitalLogEntry>>({})
  const [cartCount, setCartCount] = useState(0)
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set())

  // 콜백 참조를 고정해야 web-vitals가 중복 보고하지 않는다 (공식 문서 권고)
  const handleWebVitals = useCallback((metric: WebVitalMetric) => {
    setLogsByName((prev) => upsertByName(prev, metric))
  }, [])

  useReportWebVitals(handleWebVitals)

  const logs = Object.values(logsByName).sort((a, b) => a.receivedAt - b.receivedAt)

  const handleAddToCart = () => setCartCount((n) => n + 1)
  const handleToggleWishlist = (productId: string) =>
    setWishlisted((prev) => {
      const next = new Set(prev)
      next.has(productId) ? next.delete(productId) : next.add(productId)
      return next
    })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          장바구니 <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{cartCount}</span>개 담김
        </p>
        <DemoResetButton label="페이지 새로고침으로 재측정" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {DEMO_PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart()}
            onToggleWishlist={() => handleToggleWishlist(product.id)}
            isWishlisted={wishlisted.has(product.id)}
          />
        ))}
      </div>

      <div className="rounded border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
            useReportWebVitals 실시간 수신 로그
          </span>
          <span className="font-mono text-[11px] text-zinc-400">{logs.length}건 수신</span>
        </div>
        {logs.length === 0 ? (
          <p className="font-mono text-xs text-zinc-400">
            대기 중 — 상품을 클릭하거나 다른 탭으로 전환했다가 돌아와 보세요.
          </p>
        ) : (
          <ul className="space-y-1.5 font-mono text-xs">
            {logs.map(({ metric }) => (
              <li key={metric.name} className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${RATING_DOT[metric.rating] ?? 'bg-zinc-400'}`} />
                <span className="w-12 shrink-0 font-bold text-zinc-800 dark:text-zinc-200">{metric.name}</span>
                <span className="text-zinc-600 dark:text-zinc-400">{metric.value.toFixed(1)}</span>
                <span className="text-zinc-400">·{metric.rating}</span>
                <span className="text-zinc-400">· nav={metric.navigationType}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <VerificationFooter logs={logs} />
    </div>
  )
}
