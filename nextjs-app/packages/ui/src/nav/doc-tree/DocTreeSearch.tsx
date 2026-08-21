'use client'

import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '../../primitives/Input'

export interface DocTreeSearchProps {
  value: string
  onChange: (next: string) => void
}

/** 트리 상단에 고정된 검색창. 스크롤되지 않는다. */
export function DocTreeSearch({ value, onChange }: DocTreeSearchProps) {
  return (
    <div className="shrink-0 pb-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
        <Input
          type="text"
          padding="withIcon"
          placeholder="문서 목차 검색..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-2.5 top-2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
