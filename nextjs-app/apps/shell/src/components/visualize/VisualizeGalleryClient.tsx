'use client'

import { VISUALIZE_GROUPS } from './data'
import { visualizeCatalog, visualizeGroupLabels } from './catalog'
import { matchesVisualizeQuery } from './search'
import { VisualizeFilterTabs } from './VisualizeFilterTabs'
import { VisualizeSearch } from './VisualizeSearch'
import { VisualizeRow } from './VisualizeRow'
import { useVisualizeFilters } from './useVisualizeFilters'
import { useVisualizeListRestoration } from './useVisualizeNavigation'
import type { VisualizeFilterOption } from './types'
import './visualize.css'

const filterOptions: VisualizeFilterOption[] = [
  { key: 'all', label: '전체', count: visualizeCatalog.length },
  ...VISUALIZE_GROUPS.map((key) => ({ key, label: visualizeGroupLabels[key], count: visualizeCatalog.filter((entry) => entry.group === key).length })),
]

export function VisualizeGalleryClient() {
  const filters = useVisualizeFilters()
  const matches = visualizeCatalog.filter((entry) =>
    (filters.group === 'all' || entry.group === filters.group) && matchesVisualizeQuery(entry, filters.query))
  useVisualizeListRestoration(filters.listUrl, !filters.redirecting)

  return (
    <div className="space-y-5">
      <VisualizeSearch value={filters.query} onChange={filters.setQuery}
        onCompositionStart={filters.startComposition} onCompositionEnd={filters.endComposition} />
      <VisualizeFilterTabs options={filterOptions} activeGroup={filters.group} onSelectGroup={filters.setGroup} />
      <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-zinc-500 dark:text-zinc-400">
        {filters.query.trim() ? `“${filters.query.trim()}” 검색 결과` : '시각화'} <span className="font-medium text-zinc-900 dark:text-zinc-100">{matches.length}개</span>
      </p>
      {matches.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="text-base font-semibold">일치하는 시각화가 없습니다</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">다른 검색어를 입력하거나 검색과 필터를 초기화해 보세요.</p>
          <button type="button" onClick={filters.reset} className="visualize-press mt-4 min-h-11 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500">검색·필터 초기화</button>
        </div>
      ) : (
        <div className="space-y-7">
          {VISUALIZE_GROUPS.map((group) => {
            const entries = matches.filter((entry) => entry.group === group)
            if (!entries.length) return null
            return (
              <section key={group} aria-labelledby={`group-${group}`}>
                <div className="mb-3 flex items-center gap-2 px-3 sm:px-4">
                  <h2 id={`group-${group}`} className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{visualizeGroupLabels[group]}</h2>
                  <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium tabular-nums text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{entries.length}</span>
                </div>
                <ul className="divide-y divide-zinc-100 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                  {entries.map((entry) => <VisualizeRow key={entry.key} entry={entry} />)}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
