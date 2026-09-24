'use client'
import React, { useActionState } from 'react'
import { openReviewEditor } from '../actions'

interface Props {
  productId: string
  reviews: { id: string; authorId: string }[]
}

export function ReviewEditForm({ productId, reviews }: Props) {
  const [state, formAction, isPending] = useActionState(openReviewEditor, null)

  return (
    <form action={formAction} className="space-y-2 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <input type="hidden" name="productId" value={productId} />
      <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">리뷰 수정 (Server Action, 로그인 사용자: user-kim)</h5>
      <div className="flex flex-wrap gap-2">
        {reviews.map((r) => (
          <button
            key={r.id}
            type="submit"
            name="reviewId"
            value={r.id}
            disabled={isPending}
            className="cursor-pointer rounded bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {r.id} 수정 열기 (작성자 {r.authorId})
          </button>
        ))}
      </div>
      <p className="font-mono text-[11px] text-zinc-600 dark:text-zinc-400" data-action-result>
        {isPending
          ? 'Server Action 실행 중...'
          : state
            ? `수정 화면 열림: ${state.reviewId} "${state.body}" (${state.openedAt})`
            : '버튼을 누르면 실제 POST 요청으로 Server Action이 실행됩니다.'}
      </p>
    </form>
  )
}
