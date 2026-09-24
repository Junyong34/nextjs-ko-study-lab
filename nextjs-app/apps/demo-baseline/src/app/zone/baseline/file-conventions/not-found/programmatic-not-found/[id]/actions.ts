'use server'

import { notFound } from 'next/navigation'
import { DEMO_VIEWER_ID, findReview } from '../lib/catalog'
import { markAfterNotFound, markBeforeNotFound, markRendered } from '../lib/probe-store'

export interface EditReviewState {
  reviewId: string
  body: string
  openedAt: string
}

/**
 * 호출 지점 ③: Server Action
 * 리뷰 수정 화면을 열기 전에 작성자 본인인지 확인한다. 권한이 없으면 403 대신 notFound()로
 * "그런 리뷰는 없다"고 응답해 다른 사람의 리뷰 존재 여부를 노출하지 않는다.
 */
export async function openReviewEditor(
  _prev: EditReviewState | null,
  formData: FormData,
): Promise<EditReviewState | null> {
  const productId = String(formData.get('productId') ?? '')
  const reviewId = String(formData.get('reviewId') ?? '')
  const review = findReview(productId, reviewId)

  if (!review || review.authorId !== DEMO_VIEWER_ID) {
    markBeforeNotFound('action:not-owner', `action review=${reviewId} viewer=${DEMO_VIEWER_ID}`)
    notFound()
    markAfterNotFound('action:not-owner', `action review=${reviewId}`) // 실행되지 않아야 하는 줄
  }

  markRendered('action:ok', `action review=${reviewId}`)
  return { reviewId: review.id, body: review.body, openedAt: new Date().toISOString() }
}
