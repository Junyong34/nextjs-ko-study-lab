'use client'

import { useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import { createFeedbackStore, type FeedbackRating } from '@/lib/analytics/feedback'

const feedback = createFeedbackStore(() => window.sessionStorage)

export function ContentFeedback({ docId }: { docId: string }) {
  const [response, setResponse] = useState<{ docId: string; rating: FeedbackRating | null } | null>(null)
  const ready = response?.docId === docId
  const rating = ready ? response.rating : null

  useEffect(() => {
    setResponse({ docId, rating: feedback.get(docId) })
  }, [docId])

  function respond(next: FeedbackRating) {
    if (!feedback.submit(docId, next)) {
      setResponse({ docId, rating: feedback.get(docId) })
      return
    }
    setResponse({ docId, rating: next })
    trackEvent({ name: 'content_feedback', params: { rating: next } })
  }

  return (
    <fieldset className="mt-10 rounded-lg border border-border p-5">
      <legend className="px-2 text-sm font-semibold">이 문서가 도움이 되었나요?</legend>
      <div className="flex flex-wrap gap-2">
        {(['helpful', 'unhelpful'] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={rating === value}
            disabled={!ready || rating !== null}
            onClick={() => respond(value)}
            className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-default disabled:opacity-70 aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary"
          >
            {value === 'helpful' ? '도움 됐어요' : '부족해요'}
          </button>
        ))}
      </div>
      <p role="status" className="mt-3 text-sm text-muted-foreground">
        {rating ? `${rating === 'helpful' ? '도움 됐어요' : '부족해요'}를 선택했어요. 의견 감사합니다.` : '이 탭에서는 문서마다 한 번 응답할 수 있어요.'}
      </p>
    </fieldset>
  )
}
