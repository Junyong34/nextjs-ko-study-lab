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
    <div className="rounded-2xl border-2 border-purple-500/60 bg-purple-50/40 p-5 sm:p-6 dark:border-purple-600/60 dark:bg-purple-950/30 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* template.tsx 영역 안내 헤더 */}
      <div className="space-y-2 border-b border-purple-200 pb-4 dark:border-purple-800 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse shrink-0" />
            <span className="font-mono text-sm font-extrabold text-zinc-900 dark:text-white">
              template.tsx 영역
            </span>
            <span className="rounded-md bg-purple-600 px-2.5 py-0.5 font-mono text-[11px] font-bold text-white shadow-2xs dark:bg-purple-500 dark:text-white">
              라우트 전환 시 매번 재마운트 (Re-mount)
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-700 dark:text-zinc-300">
            <span>인스턴스 고유 ID: <strong className="font-bold text-purple-600 dark:text-purple-400">#{instanceId || '------'}</strong></span>
            <span>·</span>
            <span>마운트 시각: <strong className="text-zinc-900 dark:text-zinc-100">{mountTime || '--:--:--'}</strong></span>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 pt-1">
          이 보라색 테두리 영역 전체가 <code className="rounded bg-purple-100 px-1 py-0.5 font-mono font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">template.tsx</code> 컴포넌트입니다. 상단 탭을 전환하면 <code className="rounded bg-emerald-100 px-1 py-0.5 font-mono font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">layout.tsx</code>는 유지되지만 이 영역(하위 <code>page.tsx</code> 및 내부 폼 상태)은 <strong className="font-bold text-zinc-900 dark:text-zinc-100">완전히 언마운트된 후 새 인스턴스로 재생성</strong>됩니다.
        </p>
      </div>

      {/* template.tsx로 래핑된 하위 page.tsx 콘텐츠 */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
          <span>template.tsx의 {'{children}'}으로 주입된 page.tsx 콘텐츠:</span>
        </div>
        {children}
      </div>

      {/* template.tsx에 정의된 후기 작성 폼 (인스턴스 재생성 실증) */}
      <div className="mt-8 rounded-xl border border-purple-200/90 bg-white p-5 shadow-xs dark:border-purple-900/60 dark:bg-zinc-950">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 pb-3 dark:border-zinc-800 mb-4">
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            template.tsx 내부 상태 (React useState)
          </span>
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            페이지를 전환하면 아래 입력 상태가 자동 리셋됩니다
          </span>
        </div>

        {/* 평점 선택 */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            평점 선택:
          </span>
          <div
            className="inline-flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800"
            role="radiogroup"
            aria-label="평점 선택"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={rating === star}
                onClick={() => handleRatingChange(star)}
                className={`rounded-md px-3 py-1 text-xs font-mono font-semibold transition cursor-pointer ${
                  rating === star
                    ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {star}점
              </button>
            ))}
          </div>
        </div>

        {/* 후기 텍스트 입력창 */}
        <div className="space-y-1.5 mb-4">
          <label
            htmlFor="review-input"
            className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
          >
            후기 작성 (작성 후 상단의 다른 상품 탭을 클릭해 보세요):
          </label>
          <textarea
            id="review-input"
            rows={2}
            value={reviewText}
            onChange={(e) => handleReviewChange(e.target.value)}
            placeholder="후기를 작성한 뒤 상단의 다른 상품 탭을 클릭하면 template.tsx가 새 인스턴스로 재생성되어 폼이 초기화됩니다."
            className="w-full rounded-lg border border-zinc-300 bg-white p-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1 border-t border-zinc-100 pt-3 text-[11px] text-zinc-500 dark:border-zinc-800">
          <span>작성 글자 수: <strong>{reviewText.length}자</strong></span>
          <span className="font-medium text-purple-700 dark:text-purple-300">
            Next.js 규격: 탭 전환 시 인스턴스를 파기하고 새로운 컴포넌트 트리를 마운트합니다.
          </span>
        </div>
      </div>
    </div>
  )
}
