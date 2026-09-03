import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'linking-and-navigating/router-prefetch/deals')

import React from 'react'

const DEALS = [
  {
    id: 'deal-1',
    title: ' 타임 세일: 프리미엄 노이즈 캔슬링 이어폰',
    discount: '45% OFF',
    originPrice: 189000,
    salePrice: 103950,
  },
  {
    id: 'deal-2',
    title: '[즉시] 한정 수량: 4K 144Hz 게이밍 모니터 27인치',
    discount: '30% OFF',
    originPrice: 429000,
    salePrice: 300300,
  },
  {
    id: 'deal-3',
    title: ' 오늘의 특가: 기계식 무선 텐키리스 키보드',
    discount: '50% OFF',
    originPrice: 159000,
    salePrice: 79500,
  },
]

export default function DealsPage() {
  return (
    <div className="space-y-3 rounded border border-amber-300 bg-amber-50/50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200">
          오늘의 깜짝 특가 상품관 (URL: /router-prefetch/deals)
        </h3>
        <span className="rounded bg-amber-600 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
          router.prefetch() 완료 라우트
        </span>
      </div>

      <div className="space-y-2">
        {DEALS.map((deal) => (
          <div
            key={deal.id}
            className="flex items-center justify-between rounded border border-amber-200 bg-white p-3 shadow-2xs dark:border-amber-900/50 dark:bg-zinc-900"
          >
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {deal.title}
              </div>
              <div className="text-[11px] text-zinc-400 line-through">
                {deal.originPrice.toLocaleString()}원
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block rounded bg-rose-100 px-1.5 py-0.2 font-mono text-[10px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                {deal.discount}
              </span>
              <div className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
                {deal.salePrice.toLocaleString()}원
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
