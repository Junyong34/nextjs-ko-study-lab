'use client'

import React, { useState, useTransition } from 'react'
import {
  executeSequentialFetching,
  executeParallelFetching,
} from '../actions'
import type { FetchResult } from '../types'

export function ParallelFetchingController() {
  const [result, setResult] = useState<FetchResult | null>(null)
  const [isPending, startTransition] = useTransition()
  const [currentMode, setCurrentMode] = useState<'sequential' | 'parallel' | null>(null)

  const handleRunSequential = () => {
    setCurrentMode('sequential')
    startTransition(async () => {
      const res = await executeSequentialFetching('trackball-01')
      setResult(res)
    })
  }

  const handleRunParallel = () => {
    setCurrentMode('parallel')
    startTransition(async () => {
      const res = await executeParallelFetching('trackball-01')
      setResult(res)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 제어 버튼 바 */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-md border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          패칭 전략 실행:
        </span>

        {/* 직렬 Waterfall 버튼 */}
        <button
          type="button"
          onClick={handleRunSequential}
          disabled={isPending}
          className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
            currentMode === 'sequential' && result
              ? 'bg-rose-600 text-white font-bold shadow-2xs'
              : 'border border-rose-300 bg-white text-rose-800 hover:bg-rose-50 dark:border-rose-900/60 dark:bg-zinc-900 dark:text-rose-300'
          } disabled:opacity-50`}
        >
          <span>1. 직렬 Waterfall 실행 (순차 await)</span>
          <span className="rounded bg-rose-200 px-1 py-0.2 font-mono text-[9px] text-rose-900 dark:bg-rose-900 dark:text-rose-200">
            ~1,400ms
          </span>
        </button>

        {/* 병렬 Promise.all 버튼 */}
        <button
          type="button"
          onClick={handleRunParallel}
          disabled={isPending}
          className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
            currentMode === 'parallel' && result
              ? 'bg-emerald-600 text-white font-bold shadow-2xs'
              : 'border border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-zinc-900 dark:text-emerald-300'
          } disabled:opacity-50`}
        >
          <span>2. 병렬 Promise.all 실행 (동시 시작)</span>
          <span className="rounded bg-emerald-200 px-1 py-0.2 font-mono text-[9px] text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
            ~800ms
          </span>
        </button>

        {isPending && (
          <span className="inline-flex items-center gap-1 text-xs font-mono text-amber-600 dark:text-amber-400 animate-pulse">
            ● 서버에서 데이터 로딩 중...
          </span>
        )}
      </div>

      {/* 2. 패칭 타임라인 및 결과 뷰 */}
      {result ? (
        <div className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {result.mode === 'parallel' ? '[즉시] 병렬 패칭 완료' : '[대기] 직렬 Waterfall 패칭 완료'}
              </span>
              <span
                className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                  result.mode === 'parallel'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                총 소요 시간: {result.totalDurationMs}ms
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              {result.mode === 'parallel'
                ? '단축 효과: 직렬 대비 약 40% 속도 개선'
                : '지연 원인: 상품 조회가 끝난 후에야 추천 조회가 시작됨'}
            </span>
          </div>

          {/* 데이터 카드 2단 그리드 */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  상품 정보 (600ms 지연)
                </span>
                <span className="font-mono text-[10px] text-zinc-400">
                  {result.product.fetchDurationMs}ms
                </span>
              </div>
              <div className="text-zinc-700 dark:text-zinc-300">{result.product.title}</div>
              <div className="font-mono text-zinc-900 dark:text-zinc-100 font-semibold">
                {result.product.price.toLocaleString()}원
              </div>
            </div>

            <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  추천 상품 (800ms 지연)
                </span>
                <span className="font-mono text-[10px] text-zinc-400">
                  {result.recommendations[0]?.fetchDurationMs}ms
                </span>
              </div>
              <ul className="divide-y divide-zinc-200 text-zinc-600 dark:divide-zinc-800 dark:text-zinc-400 text-[11px]">
                {result.recommendations.map((rec) => (
                  <li key={rec.id} className="py-1 flex justify-between">
                    <span>{rec.name}</span>
                    <span className="text-zinc-400">{rec.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded border border-dashed border-zinc-300 p-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
          상단의 <strong>[1. 직렬 Waterfall 실행]</strong>과 <strong>[2. 병렬 Promise.all 실행]</strong> 버튼을 각각 눌러 소요 시간을 비교해 보세요.
        </div>
      )}
    </div>
  )
}
