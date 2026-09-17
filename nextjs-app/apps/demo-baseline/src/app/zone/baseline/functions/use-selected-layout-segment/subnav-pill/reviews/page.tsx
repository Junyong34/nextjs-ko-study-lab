import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'functions/use-selected-layout-segment/subnav-pill/reviews',
)

import React from 'react'
import { DEMO_PRODUCT } from '../types'

const REVIEWS = [
  { author: '구매자 A', rating: 5, content: '타건감이 정말 좋습니다. 무선 지연도 거의 없어요.' },
  { author: '구매자 B', rating: 4, content: '핫스왑 기능 덕분에 스위치 교체가 편했습니다.' },
  { author: '구매자 C', rating: 5, content: '배터리도 오래가고 만족스러운 구매였습니다.' },
]

export default function ReviewsPage() {
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
        리뷰 {DEMO_PRODUCT.reviewCount}건 (평점 {DEMO_PRODUCT.rating}) — /reviews (useSelectedLayoutSegment()
        반환값: &quot;reviews&quot;)
      </p>
      <ul className="space-y-2">
        {REVIEWS.map((review) => (
          <li key={review.author} className="rounded bg-zinc-50 p-2.5 text-xs dark:bg-zinc-900">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{review.author}</span>{' '}
            <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
            <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">{review.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
