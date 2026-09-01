'use client'

import React, { useState, useEffect } from 'react'
import { useTemplateLifecycle } from './components/TemplateLifecycleContext'

export default function ProductReviewTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  const lifecycle = useTemplateLifecycle()
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [mountTime, setMountTime] = useState<string>('')
  const [instanceId, setInstanceId] = useState<string>('')

  useEffect(() => {
    const time = new Date().toLocaleTimeString('ko-KR')
    const id = Math.random().toString(36).substring(2, 7).toUpperCase()
    setMountTime(time)
    setInstanceId(id)
    lifecycle?.registerInstance(id, 5, 0)
  }, [])

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
    lifecycle?.updateFormState(newRating, reviewText.length)
  }

  const handleReviewChange = (text: string) => {
    setReviewText(text)
    lifecycle?.updateFormState(rating, text.length)
  }

  return (
    <div className="space-y-3">
      {/* template.tsx로 래핑된 하위 page 콘텐츠 */}
      {children}

      {/* template.tsx에 정의된 후기 작성 폼 (인스턴스 재생성 실증) */}
      <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 pb-2 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
              template.tsx 클라이언트 폼
            </span>
            <span className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
              매 라우트마다 Re-mount
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
            <span>인스턴스 ID: <strong className="text-zinc-900 dark:text-zinc-100">#{instanceId || '------'}</strong></span>
            <span>·</span>
            <span>마운트: {mountTime || '--:--:--'}</span>
          </div>
        </div>

        {/* 평점 선택 */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            평점 선택:
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingChange(star)}
                className={`rounded px-1.5 py-0.5 text-xs font-mono font-semibold transition cursor-pointer ${
                  star <= rating
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'
                }`}
              >
                {star}점
              </button>
            ))}
          </div>
        </div>

        {/* 후기 텍스트 입력창 */}
        <div>
          <label
            htmlFor="review-input"
            className="mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            후기 작성 (작성 후 상단의 다른 상품 탭을 클릭해 보세요):
          </label>
          <textarea
            id="review-input"
            rows={2}
            value={reviewText}
            onChange={(e) => handleReviewChange(e.target.value)}
            placeholder="후기를 작성한 뒤 상단의 다른 상품 탭을 클릭하면 template.tsx가 새 인스턴스로 재생성되어 폼이 초기화됩니다."
            className="w-full rounded border border-zinc-300 bg-white p-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>작성 글자 수: {reviewText.length}자</span>
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            Next.js template.tsx 규칙: 페이지 전환 시 DOM 인스턴스를 파기하고 완전히 새로 마운트합니다.
          </span>
        </div>
      </div>
    </div>
  )
}
