import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'functions/use-selected-layout-segment/subnav-pill/shipping',
)

import React from 'react'

const SHIPPING_INFO = [
  '평균 배송 기간: 결제 완료 후 1~2일 이내 출고',
  '배송비: 3만원 이상 무료, 미만 3,000원',
  '제주/도서산간 지역은 추가 배송비가 발생할 수 있습니다.',
]

export default function ShippingPage() {
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
        배송 안내 — /shipping (useSelectedLayoutSegment() 반환값: &quot;shipping&quot;)
      </p>
      <ul className="list-disc list-inside space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
        {SHIPPING_INFO.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  )
}
