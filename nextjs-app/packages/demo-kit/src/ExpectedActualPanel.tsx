'use client'

import React from 'react'

export interface ExpectedActualPanelProps {
  /** 기대하는 결과 (Expected) */
  expected: React.ReactNode
  /** 실제로 측정/반환된 결과 (Actual) */
  actual: React.ReactNode
  /** 일치 여부 */
  isMatched?: boolean
  /** 패널 제목 */
  title?: string
  /** 부가 설명 */
  description?: string
  className?: string
}

/**
 * 필드셋(fieldset) 구조로 기대값과 실제값을 대조하고,
 * 개발자 친화적인 상태 배지를 제공하는 표준 검증 컴포넌트입니다.
 */
export function ExpectedActualPanel({
  expected,
  actual,
  isMatched,
  title = '기대값 vs 실제값 검증',
  description,
  className = '',
}: ExpectedActualPanelProps) {
  const autoMatched =
    typeof expected === 'string' && typeof actual === 'string'
      ? expected.trim() === actual.trim()
      : typeof expected === 'number' && typeof actual === 'number'
      ? expected === actual
      : undefined

  const matched = isMatched !== undefined ? isMatched : autoMatched

  return (
    <fieldset
      className={`rounded-lg border p-4 sm:p-5 shadow-2xs transition-colors ${
        matched === true
          ? 'border-emerald-500/80 bg-emerald-50/20 dark:border-emerald-800 dark:bg-emerald-950/10'
          : matched === false
          ? 'border-rose-400 bg-rose-50/20 dark:border-rose-800 dark:bg-rose-950/10'
          : 'border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-950'
      } ${className}`}
    >
      {/* 1. 필드셋 범례 (Legend) */}
      <legend className="flex items-center gap-2 px-2.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
        <span>[검증] {title}</span>
        {matched === true && (
          <span className="rounded bg-emerald-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
            검증 완료
          </span>
        )}
        {matched === false && (
          <span className="rounded bg-rose-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">
            불일치
          </span>
        )}
        {matched === undefined && (
          <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            대기 중
          </span>
        )}
      </legend>

      {/* 2. 상태 요약 메시지 */}
      {description && (
        <div className="mb-3.5 rounded border border-zinc-200/80 bg-zinc-50/80 px-3.5 py-2 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 leading-relaxed">
          {description}
        </div>
      )}

      {/* 3. 기대값 vs 실제값 대조 그리드 */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {/* 기대값 */}
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="mb-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            기대 결과 (Expected)
          </div>
          <div className="font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
            {expected}
          </div>
        </div>

        {/* 실제값 */}
        <div
          className={`rounded border p-3.5 transition-colors ${
            matched === true
              ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950 dark:border-emerald-800/80 dark:bg-emerald-950/40 dark:text-emerald-200'
              : 'border-zinc-200 bg-zinc-50 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200'
          }`}
        >
          <div className="mb-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
            실제 측정값 (Actual)
          </div>
          <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {actual}
          </div>
        </div>
      </div>
    </fieldset>
  )
}
