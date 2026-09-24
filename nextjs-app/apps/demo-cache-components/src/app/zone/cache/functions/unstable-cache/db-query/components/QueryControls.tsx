'use client'

import React from 'react'
import { CATEGORIES, CATEGORY_IDS, TAGS } from '../tags'
import type { Category, Currency } from '../types'

interface QueryControlsProps {
  disabled: boolean
  onQuery: (category: Category) => void
  onSummary: (currency: Currency, includeInKey: boolean) => void
  onInvalidate: (scope: Category | 'all') => void
  onRaise: (category: Category) => void
}

const btn = 'cursor-pointer rounded px-2.5 py-1 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50'
const primary = `${btn} bg-blue-600 text-white hover:bg-blue-700`
const warn = `${btn} bg-rose-600 text-white hover:bg-rose-700`
const ghost = `${btn} border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200`

export function QueryControls({ disabled, onQuery, onSummary, onInvalidate, onRaise }: QueryControlsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="space-y-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
          A. 인자 기반 키 · tags · revalidate
        </div>
        <code className="block text-[10px] text-zinc-500">getProductsByCategory(category) — 인자가 키에 자동 포함</code>
        {CATEGORY_IDS.map((c) => (
          <div key={c} className="flex flex-wrap items-center gap-1.5">
            <span className="w-14 shrink-0 text-[11px] text-zinc-600 dark:text-zinc-400">{CATEGORIES[c]}</span>
            <button type="button" className={primary} disabled={disabled} onClick={() => onQuery(c)}>
              조회
            </button>
            <button type="button" className={ghost} disabled={disabled} onClick={() => onRaise(c)}>
              가격 +1,000원
            </button>
            <button
              type="button"
              className={warn}
              disabled={disabled}
              onClick={() => onInvalidate(c)}
              title={`updateTag('${TAGS.category(c)}')`}
            >
              updateTag
            </button>
          </div>
        ))}
        <div className="flex items-center gap-1.5 border-t border-zinc-200 pt-2 dark:border-zinc-800">
          <span className="w-14 shrink-0 text-[11px] text-zinc-600 dark:text-zinc-400">전체</span>
          <button
            type="button"
            className={warn}
            disabled={disabled}
            onClick={() => onInvalidate('all')}
            title={`updateTag('${TAGS.all}')`}
          >
            updateTag(전체 태그)
          </button>
        </div>
      </div>

      <div className="space-y-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">B. 클로저 변수와 keyParts</div>
        <code className="block text-[10px] text-zinc-500">
          getPriceSummary(currency) — 캐시 함수는 인자 없이 바깥 currency를 읽음
        </code>
        {([true, false] as const).map((keyed) => (
          <div key={String(keyed)} className="flex flex-wrap items-center gap-1.5">
            <span className="w-24 shrink-0 text-[11px] text-zinc-600 dark:text-zinc-400">
              keyParts {keyed ? '포함' : '누락'}
            </span>
            {(['KRW', 'USD'] as const).map((cur) => (
              <button
                key={cur}
                type="button"
                className={keyed ? primary : `${btn} bg-amber-600 text-white hover:bg-amber-700`}
                disabled={disabled}
                onClick={() => onSummary(cur, keyed)}
              >
                {cur} 합계
              </button>
            ))}
          </div>
        ))}
        <p className="text-[10px] leading-relaxed text-zinc-500">
          포함: <code>[prefix, &apos;price-summary&apos;, currency]</code> / 누락:{' '}
          <code>[prefix, &apos;price-summary&apos;]</code>
        </p>
      </div>
    </div>
  )
}
