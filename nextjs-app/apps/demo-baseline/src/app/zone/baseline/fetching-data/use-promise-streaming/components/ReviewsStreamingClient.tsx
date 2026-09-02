'use client'

import React, { use, useState, Suspense } from 'react'
import type { ProductReview, RecommendationItem } from '../types'
import { fetchReviewsPromise, fetchRecommendationsPromise } from '../actions'
import { ReviewsSkeleton } from './ReviewsSkeleton'
import { RecommendationsSkeleton } from './RecommendationsSkeleton'
import { VerificationFooter } from './VerificationFooter'

/**
 * 1. 후기 데이터 React 19 use(Promise) 언랩 컴포넌트 (1.2초)
 */
function ReviewsContent({
  reviewsPromise,
  delayMs,
}: {
  reviewsPromise: Promise<ProductReview[]>
  delayMs: number
}) {
  const reviews = use(reviewsPromise)

  return (
    <div className="space-y-4 rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/20 p-5 sm:p-6 dark:border-emerald-600/80 dark:bg-emerald-950/20 shadow-xs animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 pb-3 dark:border-emerald-800/80">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <h4 className="font-mono text-sm font-extrabold text-zinc-900 dark:text-white">
            구매 고객 실시간 후기 ({reviews.length}개)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-emerald-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white shadow-2xs dark:bg-emerald-500">
            ✅ [1등 도착] use(reviewsPromise) 언랩 완료 ({delayMs}ms)
          </span>
        </div>
      </div>

      <div className="space-y-2.5 pt-1">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-emerald-200/70 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs space-y-1"
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
    </div>
  )
}

/**
 * 2. 추천 상품 데이터 React 19 use(Promise) 언랩 컴포넌트 (2.5초)
 */
function RecommendationsContent({
  recommendationsPromise,
  delayMs,
}: {
  recommendationsPromise: Promise<RecommendationItem[]>
  delayMs: number
}) {
  const items = use(recommendationsPromise)

  return (
    <div className="space-y-4 rounded-2xl border-2 border-purple-500/80 bg-purple-50/20 p-5 sm:p-6 dark:border-purple-600/80 dark:bg-purple-950/20 shadow-xs animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200/80 pb-3 dark:border-purple-800/80">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-purple-500" />
          <h4 className="font-mono text-sm font-extrabold text-zinc-900 dark:text-white">
            함께 구매하면 좋은 AI 추천 상품 ({items.length}개)
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-purple-600 px-2.5 py-1 font-mono text-[11px] font-bold text-white shadow-2xs dark:bg-purple-500">
            ✅ [2등 도착] use(recommendationsPromise) 언랩 완료 ({delayMs}ms)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-purple-200/70 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-2xs space-y-1.5 flex flex-col justify-between"
          >
            <div>
              <span className="inline-block rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                {item.matchRate}
              </span>
              <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {item.title}
              </h5>
            </div>
            <div className="font-mono text-xs font-bold text-purple-700 dark:text-purple-300">
              {item.price.toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 실습 컨트롤러 Client Component
 */
export function ReviewsStreamingClient() {
  const [reviewsDelayMs, setReviewsDelayMs] = useState<number>(1200)
  const [recDelayMs, setRecDelayMs] = useState<number>(2500)
  const [reviewsPromise, setReviewsPromise] = useState<Promise<ProductReview[]> | null>(null)
  const [recPromise, setRecPromise] = useState<Promise<RecommendationItem[]> | null>(null)
  const [runKey, setRunKey] = useState<number>(0)
  const [reviewsDone, setReviewsDone] = useState<boolean>(false)
  const [recDone, setRecDone] = useState<boolean>(false)

  const handleStartStreaming = () => {
    setReviewsDone(false)
    setRecDone(false)

    // 2개의 독립된 비동기 Promise 생성 (각각 다른 지연시간)
    const p1 = fetchReviewsPromise(reviewsDelayMs)
    p1.then(() => setReviewsDone(true))
    setReviewsPromise(p1)

    const p2 = fetchRecommendationsPromise(recDelayMs)
    p2.then(() => setRecDone(true))
    setRecPromise(p2)

    setRunKey((prev) => prev + 1)
  }

  const handleReset = () => {
    setReviewsPromise(null)
    setRecPromise(null)
    setReviewsDone(false)
    setRecDone(false)
  }

  const isStreamingStarted = reviewsPromise !== null

  return (
    <div className="space-y-8">
      {/* 1. 스트리밍 제어 콘솔 (지연시간 선택 및 시작 버튼) */}
      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/90 p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-xs mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 pb-3 dark:border-zinc-800">
          <div>
            <h4 className="font-mono text-sm font-extrabold text-zinc-900 dark:text-white">
              React 19 use(Promise) 다중 스트리밍 제어 콘솔
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              서로 다른 지연 시간(1.2초 후기 vs 2.5초 추천)을 가진 2개의 Promise가 각각의 Suspense 스켈레톤을 거쳐 순차적으로 언랩되는 과정을 확인해 보세요.
            </p>
          </div>
          <span className="rounded bg-indigo-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            다중 점진적 스트리밍
          </span>
        </div>

        {/* 아키텍처 비교 요약 박스 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3.5 dark:border-rose-900/40 dark:bg-rose-950/20 space-y-1">
            <span className="font-bold text-rose-800 dark:text-rose-300 text-[11px] block">
              ❌ 기존 방식 (둘 다 await 할 때 - 전체 블로킹)
            </span>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              가장 느린 API(2.5초)가 끝날 때까지 <strong>메인 상품명과 가격조차 화면에 뜨지 않고 2.5초간 흰 화면 대기</strong>
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/20 space-y-1">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 text-[11px] block">
              ✅ React 19 스트리밍 방식 (Promise 개별 전달)
            </span>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <strong>0초</strong>: 메인 상품 즉시 렌더 ➔ <strong>1.2초</strong>: 후기 언랩 ➔ <strong>2.5초</strong>: 추천 상품 언랩 (점진적 화면 완성)
            </p>
          </div>
        </div>

        {/* 실행 및 리셋 버튼 */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleStartStreaming}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-indigo-700 cursor-pointer"
          >
            <span>⚡ 1. 점진적 병렬 스트리밍 시작 (1.2초 후기 & 2.5초 추천)</span>
          </button>

          {isStreamingStarted && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
            >
              🔄 초기화
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. [스트리밍 영역 1] 구매 고객 후기 (1.2초) */}
      {/* ========================================================= */}
      <div className="space-y-3 rounded-2xl border-2 border-dashed border-emerald-500/70 bg-emerald-50/15 p-5 sm:p-6 dark:border-emerald-600/70 dark:bg-emerald-950/20 mb-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 pb-3 dark:border-emerald-900/80">
          <div className="flex items-center gap-2">
            <span className="text-base">🌊</span>
            <div>
              <span className="font-mono text-xs sm:text-sm font-extrabold text-emerald-950 dark:text-emerald-200">
                [스트리밍 1] 구매 고객 후기 영역 (지연 시간: 1.2초)
              </span>
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400">
                &lt;Suspense fallback 1&gt; 바운더리 ➔ use(reviewsPromise) 언랩
              </span>
            </div>
          </div>

          <div>
            {reviewsDone ? (
              <span className="rounded-md bg-emerald-600 px-2.5 py-1 font-mono text-[10px] font-bold text-white shadow-2xs dark:bg-emerald-500">
                ● 스트리밍 1 완료 (1.2초 도착)
              </span>
            ) : reviewsPromise !== null ? (
              <span className="rounded-md bg-amber-500 px-2.5 py-1 font-mono text-[10px] font-bold text-white shadow-2xs animate-pulse">
                ⏳ 스트리밍 1 수신 중 (1.2초 대기)
              </span>
            ) : (
              <span className="rounded-md bg-zinc-200 px-2.5 py-1 font-mono text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                대기 중 (버튼 클릭 전)
              </span>
            )}
          </div>
        </div>

        <div className="pt-2">
          {reviewsPromise === null ? (
            <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-white/70 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/50 space-y-1.5">
              <div className="text-xl">💬</div>
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                구매 고객 후기 스트리밍 대기 중
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                상단 [스트리밍 시작]을 누르면 1.2초 동안 스켈레톤이 렌더링된 후 실제 후기 UI로 전환됩니다.
              </p>
            </div>
          ) : (
            <Suspense key={`rev-${runKey}`} fallback={<ReviewsSkeleton delayMs={reviewsDelayMs} />}>
              <ReviewsContent reviewsPromise={reviewsPromise} delayMs={reviewsDelayMs} />
            </Suspense>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. [스트리밍 영역 2] AI 맞춤 추천 상품 (2.5초) */}
      {/* ========================================================= */}
      <div className="space-y-3 rounded-2xl border-2 border-dashed border-purple-500/70 bg-purple-50/15 p-5 sm:p-6 dark:border-purple-600/70 dark:bg-purple-950/20 mb-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-200 pb-3 dark:border-purple-900/80">
          <div className="flex items-center gap-2">
            <span className="text-base">✨</span>
            <div>
              <span className="font-mono text-xs sm:text-sm font-extrabold text-purple-950 dark:text-purple-200">
                [스트리밍 2] AI 맞춤 추천 상품 영역 (지연 시간: 2.5초)
              </span>
              <span className="block text-[10px] text-purple-700 dark:text-purple-400">
                &lt;Suspense fallback 2&gt; 바운더리 ➔ use(recommendationsPromise) 언랩
              </span>
            </div>
          </div>

          <div>
            {recDone ? (
              <span className="rounded-md bg-purple-600 px-2.5 py-1 font-mono text-[10px] font-bold text-white shadow-2xs dark:bg-purple-500">
                ● 스트리밍 2 완료 (2.5초 도착)
              </span>
            ) : recPromise !== null ? (
              <span className="rounded-md bg-purple-500 px-2.5 py-1 font-mono text-[10px] font-bold text-white shadow-2xs animate-pulse">
                ⏳ 스트리밍 2 수신 중 (2.5초 대기)
              </span>
            ) : (
              <span className="rounded-md bg-zinc-200 px-2.5 py-1 font-mono text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                대기 중 (버튼 클릭 전)
              </span>
            )}
          </div>
        </div>

        <div className="pt-2">
          {recPromise === null ? (
            <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-white/70 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900/50 space-y-1.5">
              <div className="text-xl">🎁</div>
              <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                AI 맞춤 추천 상품 스트리밍 대기 중
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                후기(1.2초)가 먼저 도착한 뒤에도 추천 상품은 2.5초까지 독립적으로 스켈레톤을 유지하다가 마운트됩니다.
              </p>
            </div>
          ) : (
            <Suspense key={`rec-${runKey}`} fallback={<RecommendationsSkeleton delayMs={recDelayMs} />}>
              <RecommendationsContent recommendationsPromise={recPromise} delayMs={recDelayMs} />
            </Suspense>
          )}
        </div>
      </div>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter
        isStarted={isStreamingStarted}
        reviewsDone={reviewsDone}
        recDone={recDone}
      />
    </div>
  )
}
