'use client'

import React, { use, useState, Suspense } from 'react'
import type { ProductReview } from '../types'
import { fetchReviewsPromise } from '../actions'
import { ReviewsSkeleton } from './ReviewsSkeleton'
import { VerificationFooter } from './VerificationFooter'

/**
 * React 19 use(Promise)로 언랩하는 하위 컴포넌트
 */
function ReviewsContent({
  reviewsPromise,
  delayMs,
  onReset,
}: {
  reviewsPromise: Promise<ProductReview[]>
  delayMs: number
  onReset: () => void
}) {
  // React 19 use() Hook: 전달받은 Promise를 동기식으로 언랩하며, Pending 상태일 땐 상위 Suspense로 suspend
  const reviews = use(reviewsPromise)

  return (
    <div className="space-y-4 rounded-2xl border-2 border-emerald-500/60 bg-emerald-50/20 p-5 sm:p-6 dark:border-emerald-700/60 dark:bg-emerald-950/20 shadow-xs animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 pb-3 dark:border-emerald-800/80">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <h4 className="font-mono text-sm font-extrabold text-zinc-900 dark:text-white">
            구매 고객 실시간 후기 ({reviews.length}개)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-emerald-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white shadow-2xs dark:bg-emerald-500">
            ✅ use(Promise) 언랩 완료 ({delayMs}ms 지연)
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-emerald-200/70 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs space-y-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                👤 {review.author}
              </span>
              <span className="font-mono text-xs text-amber-500 font-bold">
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </span>
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {review.comment}
            </p>
            <div className="text-[10px] text-zinc-400 font-mono">
              작성일: {review.createdAt}
            </div>
          </div>
        ))}
      </div>

      {/* 다시 실행 버튼 */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 shadow-2xs transition cursor-pointer"
        >
          🔄 스트리밍 다시 실행 (Reset)
        </button>
      </div>
    </div>
  )
}

/**
 * 실습 컨트롤러 Client Component:
 * 바로 실행되지 않고 버튼을 클릭해야 Promise가 시작되도록 제어합니다.
 */
export function ReviewsStreamingClient() {
  const [delayMs, setDelayMs] = useState<number>(1500)
  const [reviewsPromise, setReviewsPromise] = useState<Promise<ProductReview[]> | null>(null)
  const [runKey, setRunKey] = useState<number>(0)
  const [hasCompleted, setHasCompleted] = useState<boolean>(false)

  const handleStartStreaming = () => {
    setHasCompleted(false)
    const promise = fetchReviewsPromise(delayMs)
    promise.then(() => setHasCompleted(true))
    setReviewsPromise(promise)
    setRunKey((prev) => prev + 1)
  }

  const handleReset = () => {
    setReviewsPromise(null)
    setHasCompleted(false)
  }

  return (
    <div className="space-y-6">
      {/* 1. 스트리밍 제어 콘솔 (지연시간 선택 및 시작 버튼) */}
      <div className="space-y-3.5 rounded-2xl border border-zinc-200 bg-zinc-50/90 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 pb-3 dark:border-zinc-800">
          <div>
            <h4 className="font-mono text-sm font-extrabold text-zinc-900 dark:text-white">
              React 19 use(Promise) 스트리밍 제어 콘솔
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              지연 시간을 선택한 후 버튼을 눌러 Promise 생성 및 Suspense 스켈레톤 전환을 관찰해 보세요.
            </p>
          </div>
          <span className="rounded bg-indigo-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            인터랙티브 실행 모드
          </span>
        </div>

        {/* 지연 시간 선택 라디오/버튼 */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mr-1">
            서버 지연 시간 설정:
          </span>
          {[800, 1500, 2500].map((ms) => (
            <button
              key={ms}
              type="button"
              onClick={() => setDelayMs(ms)}
              disabled={reviewsPromise !== null && !hasCompleted}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                delayMs === ms
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold shadow-2xs'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700'
              }`}
            >
              {ms}ms {ms === 1500 ? '(권장)' : ''}
            </button>
          ))}
        </div>

        {/* 실행 버튼 */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleStartStreaming}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-indigo-700 cursor-pointer"
          >
            <span>⚡ 1. 구매 고객 후기 스트리밍 시작 (use(Promise) 실행)</span>
          </button>

          {reviewsPromise && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {/* 2. 스트리밍 렌더링 영역 (Suspense 바운더리) */}
      <div className="mb-8">
        {reviewsPromise === null ? (
          /* 대기 상태 플레이스홀더 */
          <div className="rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/30 space-y-2">
            <div className="text-2xl">📦</div>
            <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              구매 고객 후기 스트리밍 대기 중
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              상단의 <strong>[⚡ 1. 구매 고객 후기 스트리밍 시작]</strong> 버튼을 클릭하면 Promise가 생성되고, <code>{'<'}Suspense{'>'}</code> 스켈레톤이 렌더링된 후 React 19 <code>use(Promise)</code>로 데이터가 언랩되는 과정을 직접 관찰하실 수 있습니다.
            </p>
          </div>
        ) : (
          /* 실제 Suspense 스트리밍 바운더리 */
          <Suspense key={runKey} fallback={<ReviewsSkeleton delayMs={delayMs} />}>
            <ReviewsContent
              reviewsPromise={reviewsPromise}
              delayMs={delayMs}
              onReset={handleReset}
            />
          </Suspense>
        )}
      </div>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter
        isStarted={reviewsPromise !== null}
        hasCompleted={hasCompleted}
        delayMs={delayMs}
      />
    </div>
  )
}
