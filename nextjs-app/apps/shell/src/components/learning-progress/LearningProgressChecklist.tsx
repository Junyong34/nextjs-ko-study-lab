'use client'

import React, { useMemo, useState } from 'react'
import { BookOpen, Layers3 } from 'lucide-react'
import { getLearningProgressSummary } from '@/lib/learning-progress/state'
import { LearningProgressList } from './LearningProgressList'
import { LearningProgressNotice } from './LearningProgressNotice'
import { useLearningProgress } from './LearningProgressProvider'

export type LearningProgressTab = 'documents' | 'demos'
type StatusFilter = 'all' | 'completed' | 'incomplete'

export function LearningProgressChecklist({
  tab,
  onTabChange,
  onNavigate,
  compact = false,
}: {
  tab: LearningProgressTab
  onTabChange: (tab: LearningProgressTab) => void
  onNavigate?: () => void
  compact?: boolean
}) {
  const { inventory, isCompleted } = useLearningProgress()
  const [status, setStatus] = useState<StatusFilter>('all')
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const sourceItems = tab === 'documents' ? inventory.documents : inventory.demos
  const categories = useMemo(
    () => Array.from(new Set(sourceItems.map((item) => item.category))),
    [sourceItems],
  )
  const categoryFilters = useMemo(
    () => [
      { value: 'all', label: '전체' },
      ...categories.map((item) => ({ value: item, label: item })),
    ],
    [categories],
  )
  const activeCategory = categories.includes(category) ? category : 'all'
  const normalizedQuery = query.trim().toLocaleLowerCase('ko')
  const progressSummary = useMemo(
    () =>
      getLearningProgressSummary(sourceItems, (item) =>
        isCompleted(item.kind, item.key),
      ),
    [isCompleted, sourceItems],
  )
  const filteredItems = useMemo(() => {
    return sourceItems.filter((item) => {
      const completed = isCompleted(item.kind, item.key)
      if (status === 'completed' && !completed) return false
      if (status === 'incomplete' && completed) return false
      if (activeCategory !== 'all' && item.category !== activeCategory) return false
      if (!normalizedQuery) return true
      return `${item.title} ${item.category} ${item.url}`
        .toLocaleLowerCase('ko')
        .includes(normalizedQuery)
    })
  }, [activeCategory, isCompleted, normalizedQuery, sourceItems, status])

  const changeTab = (nextTab: LearningProgressTab) => {
    setCategory('all')
    onTabChange(nextTab)
  }

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      <LearningProgressNotice />

      <p
        className={`flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 ${
          compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'
        }`}
        aria-live="polite"
      >
        <span className="font-semibold">
          {tab === 'documents' ? '문서' : '예제'} 학습 완료
        </span>
        <strong className="tabular-nums rounded-full bg-emerald-50 px-2.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          {progressSummary.completedCount} / {progressSummary.totalCount}
        </strong>
      </p>

      <div className="flex gap-2" role="tablist" aria-label="학습 항목 종류">
        {([
          ['documents', '문서', BookOpen],
          ['demos', '예제', Layers3],
        ] as const).map(([value, label, Icon]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => changeTab(value)}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${
              tab === value
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'border border-zinc-200 bg-white text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div
        className={`grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50 ${
          compact ? '' : 'md:grid-cols-[auto_1fr] md:p-4'
        }`}
      >
        <fieldset className="min-w-0">
          <legend className="mb-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
            진행 상태
          </legend>
          <div
            className="flex w-full overflow-hidden rounded-lg border border-zinc-300 bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800"
            aria-label="완료 상태 필터"
          >
            {([
              ['all', '전체'],
              ['completed', '완료'],
              ['incomplete', '미완료'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                aria-pressed={status === value}
                className={`flex-1 whitespace-nowrap px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100 ${
                  status === value
                    ? 'bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-white/70 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="min-w-0">
          <legend className="mb-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
            카테고리
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {categoryFilters.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                aria-pressed={activeCategory === value}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100 ${
                  activeCategory === value
                    ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <label className={compact ? '' : 'md:col-span-2'}>
          <span className="sr-only">학습 기록 검색</span>
          <input
            type="search"
            name="learning-progress-query"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="제목 또는 경로 검색…"
            className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
      </div>

      <LearningProgressList
        items={filteredItems}
        compact={compact}
        onNavigate={onNavigate}
        isCompleted={(key) => isCompleted(tab === 'documents' ? 'document' : 'demo', key)}
      />
    </div>
  )
}
