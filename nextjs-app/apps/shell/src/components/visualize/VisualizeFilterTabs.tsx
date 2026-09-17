import React from 'react'
import type { FilterGroup, VisualizeFilterOption } from './types'

interface VisualizeFilterTabsProps {
  options: VisualizeFilterOption[]
  activeGroup: FilterGroup
  onSelectGroup: (group: FilterGroup) => void
}

export function VisualizeFilterTabs({
  options,
  activeGroup,
  onSelectGroup,
}: VisualizeFilterTabsProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-xs overflow-x-auto max-w-full">
      {options.map((option) => {
        const isActive = activeGroup === option.key
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onSelectGroup(option.key)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              isActive
                ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-700/60'
            }`}
          >
            <span>{option.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive
                  ? 'bg-zinc-800 text-zinc-300 dark:bg-zinc-200 dark:text-zinc-700'
                  : 'bg-zinc-200/80 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
              }`}
            >
              {option.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
