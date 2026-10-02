import type { FilterGroup, VisualizeFilterOption } from './types'

interface VisualizeFilterTabsProps {
  options: VisualizeFilterOption[]
  activeGroup: FilterGroup
  onSelectGroup: (group: FilterGroup) => void
}

export function VisualizeFilterTabs({ options, activeGroup, onSelectGroup }: VisualizeFilterTabsProps) {
  return (
    <div role="group" aria-label="시각화 그룹" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = activeGroup === option.key
        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={active}
            onClick={() => onSelectGroup(option.key)}
            className={`visualize-press inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-xs sm:text-sm font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100 ${active
              ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
              : 'border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-900'}`}
          >
            <span>{option.label}</span>
            <span className={active ? 'opacity-70 tabular-nums' : 'text-zinc-400 tabular-nums'}>{option.count}</span>
          </button>
        )
      })}
    </div>
  )
}
