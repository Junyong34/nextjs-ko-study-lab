import React from 'react'
import Link from 'next/link'
import { MOCK_PRODUCTS } from '@study/demo-kit'
import type { Currency, Tier } from '../cachedData'

const BASE_PATH = '/zone/cache/guides/migrating-cache-components/cache-key-compare'

interface CacheKeyCompareDemoProps {
  selectedSku: string
  currency: Currency
  userTier: Tier
  productName: string
  finalPrice: string
  cacheId: string
  generatedAt: string
}

function buildHref(sku: string, currency: Currency, tier: Tier) {
  return `${BASE_PATH}?sku=${sku}&currency=${currency}&tier=${tier}`
}

export function CacheKeyCompareDemo({
  selectedSku,
  currency,
  userTier,
  productName,
  finalPrice,
  cacheId,
  generatedAt,
}: CacheKeyCompareDemoProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">상품 SKU:</span>
          {MOCK_PRODUCTS.slice(0, 3).map((p) => (
            <Link
              key={p.id}
              href={buildHref(p.id, currency, userTier)}
              className={`rounded px-2 py-1 font-mono text-[11px] font-medium transition cursor-pointer ${
                selectedSku === p.id ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold' : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {p.id.toUpperCase()}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">통화:</span>
          {(['KRW', 'USD'] as const).map((curr) => (
            <Link
              key={curr}
              href={buildHref(selectedSku, curr, userTier)}
              className={`rounded px-2.5 py-1 font-mono text-[11px] font-medium transition cursor-pointer ${
                currency === curr ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold' : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {curr}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">회원 등급:</span>
          {(['NORMAL', 'VIP', 'VVIP'] as const).map((tier) => (
            <Link
              key={tier}
              href={buildHref(selectedSku, currency, tier)}
              className={`rounded px-2.5 py-1 font-mono text-[11px] font-medium transition cursor-pointer ${
                userTier === tier ? 'bg-indigo-600 text-white font-bold' : 'border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {tier}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-2xs dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{productName}</span>
          <div className="text-[11px] text-zinc-500">회원 등급 할인: {userTier} | 통화: {currency}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-zinc-400">캐시된 가격 (cacheId: #{cacheId})</div>
          <div className="font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{finalPrice}</div>
        </div>
      </div>

      <div className="rounded-lg border border-emerald-300 bg-emerald-50/40 p-4 dark:border-emerald-900 dark:bg-emerald-950/20 space-y-1 font-mono text-xs">
        <div className="font-bold text-emerald-950 dark:text-emerald-200">Next.js 16 'use cache' 자동 키 분리 (실측)</div>
        <div>getProductPrice({selectedSku}, {currency}, {userTier})</div>
        <div>cacheId: <span className="font-bold">#{cacheId}</span> · generatedAt: {generatedAt}</div>
        <p className="text-zinc-500 dark:text-zinc-400 pt-1">
          위 세 링크 중 하나를 바꾸면 cacheId가 바뀝니다. 같은 조합으로 되돌아가면 cacheId가 그대로 재사용됩니다 — 수동 키 문자열 조합 없이 인자만으로 캐시가 자동 분리된다는 증거입니다.
        </p>
      </div>
    </div>
  )
}
