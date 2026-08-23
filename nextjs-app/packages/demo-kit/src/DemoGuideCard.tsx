'use client'

import React from 'react'

export type DemoObserveLocation =
  | 'playground'
  | 'verification'
  | 'devtools'
  | 'network'
  | 'console'

export interface DemoStep {
  /** 실행 절차 단계 번호 (1부터 시작) */
  step: number
  /** 스텝 제목 (실제 UI 버튼/링크/입력 라벨을 [대괄호]로 인용) */
  title: string
  /** 단계별 상세 설명 */
  description: string
  /** 수행 동작을 나타내는 짧은 뱃지 (예: '즉시 반영', '404 트리거') */
  actionBadge?: string
  /** 이 단계에서 학습자가 관찰할 대상 — 어떤 값이 어디서 어떻게 바뀌는가 */
  observe?: string
  /** 관찰 위치. 3단 검증 패널을 가리킬 때 'verification' */
  observeAt?: DemoObserveLocation
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

const OBSERVE_LOCATION_LABELS: Record<DemoObserveLocation, string> = {
  playground: '실습 영역',
  verification: '검증 패널',
  devtools: 'DevTools',
  network: 'Network',
  console: 'Console',
}

const OBSERVE_LOCATION_STYLES: Record<DemoObserveLocation, string> = {
  verification:
    'border-emerald-200 bg-emerald-50/80 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300',
  playground:
    'border-blue-200 bg-blue-50/80 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-300',
  network:
    'border-amber-200 bg-amber-50/80 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300',
  devtools:
    'border-purple-200 bg-purple-50/80 text-purple-700 dark:border-purple-800/60 dark:bg-purple-950/40 dark:text-purple-300',
  console:
    'border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
}

/**
 * 필드셋(fieldset) 구조로 영역을 명확히 구분하고,
 * 컴팩트한 단계별 절차 목록 및 관찰 안내를 제공하는 표준 가이드 컴포넌트입니다.
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
              className="flex items-start gap-2.5 px-3.5 py-2.5 text-zinc-800 dark:text-zinc-200"
            >
              <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-zinc-200 font-mono text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {item.step}
              </span>
              <div className="flex-1 leading-snug space-y-1">
                <div>
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

                {item.observe && (
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      관찰 →
                    </span>
                    <span>{item.observe}</span>
                    {item.observeAt && (
                      <span
                        className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[9px] font-medium leading-none ${
                          OBSERVE_LOCATION_STYLES[item.observeAt] ||
                          'border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        {OBSERVE_LOCATION_LABELS[item.observeAt] || item.observeAt}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </fieldset>
  )
}
