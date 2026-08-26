'use client'

import React, { useMemo, useState } from 'react'
import { BookOpen, Layers3, RotateCcw } from 'lucide-react'
import { LearningProgressList } from './LearningProgressList'
import { LearningProgressNotice } from './LearningProgressNotice'
import { useLearningProgress } from './LearningProgressProvider'

export type LearningProgressTab = 'documents' | 'demos'
type StatusFilter = 'all' | 'completed' | 'incomplete'

export function LearningProgressChecklist({
  tab,
  onTabChange,
  compact = false,
  showReset = false,
}: {
  tab: LearningProgressTab
  onTabChange: (tab: LearningProgressTab) => void
  compact?: boolean
  showReset?: boolean
}) {
  const { inventory, isCompleted, reset } = useLearningProgress()
  const [status, setStatus] = useState<StatusFilter>('all')
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const sourceItems = tab === 'documents' ? inventory.documents : inventory.demos
  const categories = useMemo(
    () => Array.from(new Set(sourceItems.map((item) => item.category))),
    [sourceItems],
  )
  const activeCategory = categories.includes(category) ? category : 'all'
  const normalizedQuery = query.trim().toLocaleLowerCase('ko')
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

  const hasAnyRecord =
    inventory.documents.some((item) => isCompleted('document', item.key)) ||
    inventory.demos.some((item) => isCompleted('demo', item.key))

  const changeTab = (nextTab: LearningProgressTab) => {
    setCategory('all')
    onTabChange(nextTab)
  }

  const handleReset = () => {
    if (window.confirm('문서와 데모의 모든 학습 완료 표시를 초기화할까요?')) reset()
  }

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      <LearningProgressNotice />
      {!hasAnyRecord && (
        <p className="rounded-lg bg-zinc-100 px-4 py-3 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
          아직 표시한 학습 기록이 없습니다.
        </p>
      )}

      <div className="flex gap-2" role="tablist" aria-label="학습 항목 종류">
        {([
          ['documents', '문서', BookOpen],
          ['demos', '데모', Layers3],
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
          compact ? '' : 'md:grid-cols-[auto_1fr_1fr] md:p-4'
        }`}
      >
        <fieldset className="min-w-0">
          <legend className="mb-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
            진행 상태
          </legend>
          <div
            className="flex w-full rounded-lg border border-zinc-300 bg-zinc-200 p-1 dark:border-zinc-700 dark:bg-zinc-800"
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
                className={`flex-1 rounded-md px-3 py-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100 ${
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
        <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          <span className="sr-only">카테고리</span>
          <select
            value={activeCategory}
            onChange={(event) => setCategory(event.target.value)}
            className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="all">모든 카테고리</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">학습 기록 검색</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="제목 또는 경로 검색"
            className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
      </div>

      <LearningProgressList
        items={filteredItems}
        compact={compact}
        isCompleted={(key) => isCompleted(tab === 'documents' ? 'document' : 'demo', key)}
      />

      {showReset && (
        <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            전체 학습 기록 초기화
          </button>
        </div>
      )}
    </div>
  )
}
