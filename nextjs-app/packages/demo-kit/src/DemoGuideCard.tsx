'use client'

import React from 'react'

export interface DemoStep {
  step: number
  title: string
  description: string
  actionBadge?: string
}

export interface DemoGuideCardProps {
  /** 데모 주제 */
  title: string
  /** 핵심 비유 및 원리 설명 */
  concept: string
  /** 단계별 조작 절차 */
  steps: DemoStep[]
  className?: string
}

/**
 * 필드셋(fieldset) 구조로 영역을 명확히 구분하고,
 * 컴팩트한 단계별 절차 목록을 제공하는 표준 가이드 컴포넌트입니다.
 */
export function DemoGuideCard({
  title,
  concept,
  steps,
  className = '',
}: DemoGuideCardProps) {
  return (
    <fieldset
      className={`rounded-lg border border-zinc-300 bg-white p-4 sm:p-5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3.5 ${className}`}
    >
      <legend className="px-2.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
        [가이드] {title}
      </legend>

      {/* 1. 핵심 개념 및 비유 */}
      <div className="rounded border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 leading-relaxed">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">핵심 원리:</span>{' '}
        {concept}
      </div>

      {/* 2. 컴팩트 단계별 절차 리스트 */}
      <div className="mt-3 space-y-2">
        <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          실행 절차
        </div>
        <ol className="divide-y divide-zinc-100 rounded border border-zinc-200 bg-zinc-50/50 text-xs dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/30">
          {steps.map((item) => (
            <li
              key={item.step}
              className="flex items-start gap-2.5 px-3.5 py-2 text-zinc-800 dark:text-zinc-200"
            >
              <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-zinc-200 font-mono text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {item.step}
              </span>
              <div className="flex-1 leading-snug">
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </span>
                {item.actionBadge && (
                  <span className="ml-1.5 rounded bg-zinc-200/70 px-1.5 py-0.5 font-mono text-[9px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {item.actionBadge}
                  </span>
                )}
                <span className="text-zinc-500 dark:text-zinc-400"> — {item.description}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </fieldset>
  )
}
