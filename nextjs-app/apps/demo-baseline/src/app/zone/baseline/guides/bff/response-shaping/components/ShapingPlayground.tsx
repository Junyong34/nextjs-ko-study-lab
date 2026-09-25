'use client'

import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { SCENARIOS } from '../constants'
import type { ComparisonResult, ComparisonResults } from '../types'
import { ComparisonTable } from './ComparisonTable'
import { JsonPanels } from './JsonPanels'

interface ShapingPlaygroundProps {
  results: ComparisonResults
  selected: ComparisonResult | null
  running: string | null
  error: string | null
  onRun: (id: string) => void
  onReset: () => void
}

export function ShapingPlayground({ results, selected, running, error, onRun, onReset }: ShapingPlaygroundProps) {
  return (
    <div className="space-y-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-xs leading-relaxed text-zinc-600 break-keep dark:text-zinc-400">
          모바일 상품 카드 한 장을 그리려고 상품 ID로 조회합니다. 버튼을 누르면 같은 ID를{' '}
          <code className="font-mono">legacy</code>(원본 그대로)와 <code className="font-mono">bff</code>(가공) 두 Route
          Handler로 차례로 요청하고, 받은 본문을 브라우저에서 파싱해 크기·필드·민감 키를 잽니다.
        </p>
        <DemoResetButton onReset={onReset} disabled={running !== null} />
      </div>

      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => {
          const done = Boolean(results[s.id])
          const active = selected?.id === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onRun(s.id)}
              disabled={running !== null}
              className={`cursor-pointer rounded-lg border px-3 py-1.5 text-left text-xs disabled:opacity-50 ${
                active
                  ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                  : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200'
              }`}
            >
              <span className="font-bold">{running === s.id ? '요청 중...' : s.label}</span>
              <span className="block text-[10px] opacity-70">
                {s.hint}
                {done ? ' · 측정됨' : ''}
              </span>
            </button>
          )
        })}
      </div>

      {error && (
        <p className="rounded border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </p>
      )}

      {selected ? (
        <>
          <ComparisonTable result={selected} />
          <JsonPanels result={selected} />
        </>
      ) : (
        <p className="rounded border border-dashed border-zinc-300 px-3 py-6 text-center text-xs text-zinc-500 dark:border-zinc-700">
          상품 버튼을 누르면 원본 응답과 BFF 응답의 실측 비교표와 JSON 본문이 여기에 표시됩니다.
        </p>
      )}
    </div>
  )
}
