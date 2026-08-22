'use client'

import React, { useState } from 'react'
import { MOCK_PRODUCTS } from '@study/demo-kit'

export function CacheKeyCompareDemo() {
  const [selectedSku, setSelectedSku] = useState<string>('prod-001')
  const [currency, setCurrency] = useState<'KRW' | 'USD'>('KRW')
  const [userTier, setUserTier] = useState<'NORMAL' | 'VIP' | 'VVIP'>('VIP')

  const product = MOCK_PRODUCTS.find((p) => p.id === selectedSku) || MOCK_PRODUCTS[0]

  // Discount calculation based on tier
  const discountRate = userTier === 'VVIP' ? 0.25 : userTier === 'VIP' ? 0.15 : 0
  const basePriceKrw = product.price
  const discountedKrw = Math.round(basePriceKrw * (1 - discountRate))
  const exchangeRate = 1350
  const finalPrice =
    currency === 'KRW'
      ? `${discountedKrw.toLocaleString()}원`
      : `$${(discountedKrw / exchangeRate).toFixed(2)}`

  // 1. Legacy Next.js 14 manual composite key & tags
  const legacyCacheKey = `['ecommerce:product', '${selectedSku}', '${currency}', '${userTier}'].join(':')`
  const legacyEvaluatedKey = `ecommerce:product:${selectedSku}:${currency}:${userTier}`
  const legacyTags = `['product-${selectedSku}', 'currency-${currency}', 'tier-${userTier}']`

  // 2. Next.js 16 'use cache' AST argument auto-hashing
  const next16CallSignature = `getProductDetail('${selectedSku}', '${currency}', '${userTier}')`
  // Deterministic 8-char pseudo hash for display
  const rawArgs = `${selectedSku}|${currency}|${userTier}`
  let hashVal = 0
  for (let i = 0; i < rawArgs.length; i++) {
    hashVal = (hashVal << 5) - hashVal + rawArgs.charCodeAt(i)
    hashVal |= 0
  }
  const computedAstHash = `sha256:ast_${Math.abs(hashVal).toString(16).padStart(8, '0')}`

  return (
    <div className="space-y-4">
      {/* 1. 이커머스 파라미터 선택기 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        {/* 상품 SKU */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">상품 SKU:</span>
          {MOCK_PRODUCTS.slice(0, 3).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedSku(p.id)}
              className={`rounded px-2 py-1 font-mono text-[11px] font-medium transition cursor-pointer ${
                selectedSku === p.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                  : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {p.id.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 결제 통화 */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">통화 (Currency):</span>
          {(['KRW', 'USD'] as const).map((curr) => (
            <button
              key={curr}
              type="button"
              onClick={() => setCurrency(curr)}
              className={`rounded px-2.5 py-1 font-mono text-[11px] font-medium transition cursor-pointer ${
                currency === curr
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                  : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {curr}
            </button>
          ))}
        </div>

        {/* 회원 등급 */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">회원 등급:</span>
          {(['NORMAL', 'VIP', 'VVIP'] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setUserTier(tier)}
              className={`rounded px-2.5 py-1 font-mono text-[11px] font-medium transition cursor-pointer ${
                userTier === tier
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 실시간 계산된 상품 요약 */}
      <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-2xs dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {product.name}
          </span>
          <div className="text-[11px] text-zinc-500">
            회원 등급 할인: {userTier} ({discountRate * 100}%) | 기본가: {product.price.toLocaleString()}원
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-zinc-400">최종 캐시된 가격</div>
          <div className="font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
            {finalPrice}
          </div>
        </div>
      </div>

      {/* 3. 캐시 키 비교 그리드 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs font-mono">
        {/* 레거시 수동 키 */}
        <div className="rounded-lg border border-amber-300 bg-amber-50/40 p-4 dark:border-amber-900 dark:bg-amber-950/20 space-y-2">
          <div className="flex items-center justify-between border-b border-amber-200 pb-1.5 dark:border-amber-900">
            <span className="font-bold text-amber-950 dark:text-amber-200">
              Next.js 14 (레거시 unstable_cache)
            </span>
            <span className="rounded bg-amber-200 px-1.5 py-0.2 text-[10px] font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
              수동 복합 키
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] text-amber-800 dark:text-amber-400">1. 캐시 키 구성 식:</div>
            <div className="rounded bg-white p-2 text-[11px] text-zinc-800 shadow-2xs dark:bg-zinc-900 dark:text-zinc-200 break-all border border-amber-200 dark:border-amber-900">
              {legacyCacheKey}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] text-amber-800 dark:text-amber-400">2. 실제 직렬화된 키 문자열:</div>
            <div className="rounded bg-amber-100/70 p-2 text-[11px] font-bold text-amber-950 dark:bg-amber-900/50 dark:text-amber-100 break-all">
              {legacyEvaluatedKey}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] text-amber-800 dark:text-amber-400">3. 수동 태그 배열 (tags):</div>
            <div className="text-[10px] text-zinc-600 dark:text-zinc-400 break-all">
              {legacyTags}
            </div>
          </div>
        </div>

        {/* Next.js 16 자동 키 */}
        <div className="rounded-lg border border-emerald-300 bg-emerald-50/40 p-4 dark:border-emerald-900 dark:bg-emerald-950/20 space-y-2">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5 dark:border-emerald-900">
            <span className="font-bold text-emerald-950 dark:text-emerald-200">
              Next.js 16 ('use cache' 아키텍처)
            </span>
            <span className="rounded bg-emerald-200 px-1.5 py-0.2 text-[10px] font-bold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
              AST 자동 해싱
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] text-emerald-800 dark:text-emerald-400">1. 함수 호출 시그니처:</div>
            <div className="rounded bg-white p-2 text-[11px] text-zinc-800 shadow-2xs dark:bg-zinc-900 dark:text-zinc-200 break-all border border-emerald-200 dark:border-emerald-900">
              {next16CallSignature}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] text-emerald-800 dark:text-emerald-400">2. 컴파일러 자동 해시 결과:</div>
            <div className="rounded bg-emerald-100/70 p-2 text-[11px] font-bold text-emerald-950 dark:bg-emerald-900/50 dark:text-emerald-100 break-all">
              {computedAstHash}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-[11px] text-emerald-800 dark:text-emerald-400">3. 선언적 태그 (cacheTag):</div>
            <div className="text-[10px] text-zinc-600 dark:text-zinc-400 break-all">
              cacheTag('product-{selectedSku}')
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
