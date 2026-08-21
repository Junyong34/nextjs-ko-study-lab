'use client'

import React from 'react'
import { ListTree } from 'lucide-react'
import { cn } from '../../cn'
import { ACTIVE_ITEM, INACTIVE_ITEM } from '../../styles'
import type { HeadingItem } from './config'
import { ScrollTopButton } from './ScrollTopButton'

export interface TocListProps {
  headings: HeadingItem[]
  activeId: string
  onJump: (id: string) => void
  onTop: () => void
}

/** 일반 문서의 목차. h2·h3만 보여준다. */
export function TocList({ headings, activeId, onJump, onTop }: TocListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-200/70 pb-2.5 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
          <ListTree className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
          <span>이 페이지의 목차</span>
        </div>
      </div>

      <ul className="space-y-1 text-xs">
        {headings
          .filter((h) => h.level === 2 || h.level === 3)
          .map((h) => (
            <li key={h.id} style={{ paddingLeft: h.level === 3 ? '12px' : '0px' }}>
              <button
                type="button"
                onClick={() => onJump(h.id)}
                className={cn(
                  'w-full text-left truncate rounded-md px-2 py-1 transition-colors cursor-pointer',
                  activeId === h.id ? ACTIVE_ITEM : INACTIVE_ITEM,
                )}
              >
                {h.text}
              </button>
            </li>
          ))}
      </ul>

      <ScrollTopButton onClick={onTop} />
    </div>
  )
}
