import type { Metadata } from 'next'
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer } from '@study/demo-kit'
import { findProduct, findReview } from '../../../lib/catalog'
import { markAfterNotFound, markBeforeNotFound, markRendered } from '../../../lib/probe-store'
import { PNF_BASE_PATH } from '../../../types'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'file-conventions/not-found/programmatic-not-found/[id]/reviews/[reviewId]',
)

/**
 * 호출 지점 ④: 하위 세그먼트 page.tsx
 * 이 폴더(reviews/[reviewId])와 reviews/ 에는 not-found.tsx가 없다.
 * 그래서 여기서 던진 notFound()는 위로 전파되어 가장 가까운 조상 경계인 [id]/not-found.tsx가 잡는다.
 */
export default async function ReviewPage({ params }: { params: Promise<{ id: string; reviewId: string }> }) {
  const { id, reviewId } = await params
  const product = findProduct(id)
  const review = findReview(id, reviewId)

  if (!product || product.visibility !== 'public' || !review) {
    markBeforeNotFound('review-page:missing-review', `review page id=${id} review=${reviewId}`)
    notFound()
    markAfterNotFound('review-page:missing-review', `review page id=${id} review=${reviewId}`) // 실행되지 않아야 하는 줄
  }

  markRendered('review-page', `review page id=${id} review=${reviewId}`)

  return (
    <DemoContainer className="space-y-4">
      <section
        data-rendered-route="review-page"
        className="space-y-3 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
          <div>
            <p className="font-mono text-[11px] text-zinc-500">
              {product.id} / {review.id}
            </p>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">{product.name} 리뷰</h4>
          </div>
          <Link
            href={`${PNF_BASE_PATH}/${product.id}`}
            className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          >
            ← 상품으로
          </Link>
        </div>
        <p className="text-xs text-zinc-700 dark:text-zinc-300">{review.body}</p>
        <p className="font-mono text-[11px] text-zinc-500">작성자 {review.authorId}</p>
      </section>
    </DemoContainer>
  )
}
