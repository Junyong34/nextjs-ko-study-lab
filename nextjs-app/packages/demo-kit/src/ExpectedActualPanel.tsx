'use client'

import React from 'react'

export interface ExpectedActualPanelProps {
  /** 기대하는 결과 (Expected) */
  expected: React.ReactNode
  /** 실제로 측정/반환된 결과 (Actual) */
  actual: React.ReactNode
  /**
   * 일치 여부를 명시적으로 지정할 때 사용합니다.
   * 지정하지 않으면 문자열 또는 숫자일 경우 자동으로 일치 여부를 비교합니다.
   */
  isMatched?: boolean
  /** 패널 제목 (기본값: "기대값 vs 실제값 검증") */
  title?: string
  /** 부가 설명 */
  description?: string
  className?: string
}

/**
 * 데모의 기대값(Expected)과 실제값(Actual)을 나란히 표시하고
 * 일치 여부를 배지(✓ / ✗)로 시각화하는 공통 컴포넌트입니다.
 */
export function ExpectedActualPanel({
  expected,
  actual,
  isMatched,
  title = '기대값 vs 실제값 검증',
  description,
  className = '',
}: ExpectedActualPanelProps) {
  // isMatched가 주어지지 않았을 경우 기본 비교 로직
  const autoMatched =
    typeof expected === 'string' && typeof actual === 'string'
      ? expected.trim() === actual.trim()
      : typeof expected === 'number' && typeof actual === 'number'
      ? expected === actual
      : undefined

  const matched = isMatched !== undefined ? isMatched : autoMatched

  return (
    <div
      className={`my-4 overflow-hidden rounded-lg border text-sm font-sans transition-colors ${
        matched === true
          ? 'border-emerald-300/80 bg-emerald-50/40 dark:border-emerald-800/80 dark:bg-emerald-950/20'
          : matched === false
          ? 'border-rose-300/80 bg-rose-50/40 dark:border-rose-800/80 dark:bg-rose-950/20'
          : 'border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50'
      } ${className}`}
    >
      {/* 헤더 바 */}
      <div className="flex items-center justify-between border-b border-inherit px-3.5 py-2.5 bg-inherit">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {title}
          </span>
          {description && (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {description}
            </span>
          )}
        </div>

        {matched !== undefined && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
              matched
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-300'
            }`}
          >
            {matched ? '✓ 일치' : '✗ 불일치'}
          </span>
        )}
      </div>

      {/* 본문: 기대 vs 실제 그리드 */}
      <div className="grid grid-cols-1 divide-y divide-inherit sm:grid-cols-2 sm:divide-x sm:divide-y-0 p-3.5 gap-3 sm:gap-0">
        <div className="sm:pr-4">
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            기대 (Expected)
          </div>
          <div className="rounded bg-white/70 dark:bg-zinc-950/50 p-2.5 font-mono text-xs text-zinc-800 dark:text-zinc-200 break-all whitespace-pre-wrap border border-zinc-200/60 dark:border-zinc-800/60">
            {expected}
          </div>
        </div>

        <div className="sm:pl-4 pt-2 sm:pt-0">
          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            실제 (Actual)
          </div>
          <div className="rounded bg-white/70 dark:bg-zinc-950/50 p-2.5 font-mono text-xs text-zinc-800 dark:text-zinc-200 break-all whitespace-pre-wrap border border-zinc-200/60 dark:border-zinc-800/60">
            {actual}
          </div>
        </div>
      </div>
    </div>
  )
}
