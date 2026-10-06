'use client'

import { useEffect, useState } from 'react'
import { Check, ThumbsDown, ThumbsUp } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { createFeedbackStore, type FeedbackRating } from '@/lib/analytics/feedback'

const feedback = createFeedbackStore(() => window.sessionStorage)

const OPTIONS = [
  { value: 'helpful', label: '도움 됐어요', Icon: ThumbsUp },
  { value: 'unhelpful', label: '부족해요', Icon: ThumbsDown },
] as const

const BUTTON_BASE =
  'inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100'
// 응답 가능: 누를 수 있는 버튼임이 hover(pointer 커서·경계·배경)와 active로 드러나야 한다.
const BUTTON_IDLE =
  'cursor-pointer border-zinc-200 bg-white text-zinc-700 shadow-xs hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 active:scale-95 motion-reduce:active:scale-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
const BUTTON_SELECTED =
  'cursor-default border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
const BUTTON_MUTED =
  'cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-600'
// hydration 전: 레이아웃은 그대로 두고 누를 수 없음만 흐리게 표시한다.
const BUTTON_PENDING = 'cursor-default border-zinc-200 bg-white text-zinc-500 opacity-70 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'

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

  const selectedLabel = OPTIONS.find((option) => option.value === rating)?.label

  return (
    <div className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="p-0 text-sm font-bold text-zinc-900 sm:text-base dark:text-zinc-100">이 문서가 도움이 되었나요?</legend>
        <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">남겨 주신 응답은 문서를 개선하는 데 쓰여요.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
          {OPTIONS.map(({ value, label, Icon }) => {
            const selected = rating === value
            const state = !ready ? BUTTON_PENDING : selected ? BUTTON_SELECTED : rating !== null ? BUTTON_MUTED : BUTTON_IDLE
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                disabled={!ready || rating !== null}
                onClick={() => respond(value)}
                className={`${BUTTON_BASE} ${state}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
                {selected && <Check className="h-4 w-4" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      </fieldset>
      <p role="status" className="mt-3 text-xs leading-relaxed text-zinc-500 sm:text-sm dark:text-zinc-400">
        {selectedLabel ? `${selectedLabel}를 선택했어요. 의견 감사합니다.` : '이 탭에서는 문서마다 한 번 응답할 수 있어요.'}
      </p>
    </div>
  )
}
