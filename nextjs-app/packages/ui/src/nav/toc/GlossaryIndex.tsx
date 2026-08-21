'use client'

import React from 'react'
import { MapPin } from 'lucide-react'
import { cn } from '../../cn'
import { ACTIVE_ITEM, INACTIVE_ITEM } from '../../styles'
import type { HeadingItem } from './config'
import { AlphabetGrid } from './AlphabetGrid'
import { ScrollTopButton } from './ScrollTopButton'

export interface GlossaryIndexProps {
  headings: HeadingItem[]
  available: Set<string>
  activeId: string
  activeLetter: string
  onJump: (id: string) => void
  onTop: () => void
}

/** 용어집 전용 색인 맵. 일반 문서의 목차 대신 나온다. */
export function GlossaryIndex({
  headings,
  available,
  activeId,
  activeLetter,
  onJump,
  onTop,
}: GlossaryIndexProps) {
  const termCount = headings.filter((h) => h.level === 4).length
  const majorSections = headings.filter((h) => h.level === 2 && !h.isLetter)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200/70 pb-2.5 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
          <MapPin className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
          <span>용어 색인 맵 (A-Z)</span>
        </div>
        {termCount > 0 && (
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {termCount}개 용어
          </span>
        )}
      </div>

      <AlphabetGrid available={available} activeLetter={activeLetter} onJump={onJump} />

      {majorSections.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-zinc-200/70 dark:border-zinc-800">
          <span className="block text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
            주요 항목
          </span>
          <ul className="space-y-1 text-xs">
            {majorSections.map((sec) => (
              <li key={sec.id}>
                <button
                  type="button"
                  onClick={() => onJump(sec.id)}
                  className={cn(
                    'w-full text-left truncate rounded-md px-2 py-1 transition-colors cursor-pointer',
                    activeId === sec.id ? ACTIVE_ITEM : INACTIVE_ITEM,
                  )}
                >
                  {sec.text}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ScrollTopButton onClick={onTop} />
    </div>
  )
}
