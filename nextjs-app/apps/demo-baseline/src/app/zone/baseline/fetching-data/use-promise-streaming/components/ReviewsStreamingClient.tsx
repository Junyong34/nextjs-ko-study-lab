'use client'

import React, { use } from 'react'
import type { ProductReview } from '../types'

interface ReviewsStreamingClientProps {
  reviewsPromise: Promise<ProductReview[]>
}

/**
 * Client Component:
 * Server Component에서 넘겨받은 미완료 Promise를
 * React 19의 `use()` Hook으로 unwrap하여 스트리밍 렌더링합니다.
 */
export function ReviewsStreamingClient({
  reviewsPromise,
}: ReviewsStreamingClientProps) {
  const reviews = use(reviewsPromise)

  return (
    <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
          구매 고객 실시간 후기 ({reviews.length}개)
        </h4>
        <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          React 19 use(Promise) 언랩 완료
        </span>
      </div>

      <div className="space-y-2">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-1"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {review.author}
              </span>
              <span className="font-mono text-[11px] text-amber-500 font-bold">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
              {review.comment}
            </p>
            <div className="text-[10px] text-zinc-400 font-mono">
              작성일: {review.createdAt}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { VerificationFooter } from './VerificationFooter'

export function ReviewsStreamingFooter({
  reviewsPromise,
}: ReviewsStreamingClientProps) {
  const reviews = use(reviewsPromise)
  return <VerificationFooter reviews={reviews} />
}

