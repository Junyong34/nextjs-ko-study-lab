'use client'

import React from 'react'
import { ALL_ALPHABETS } from './config'

export interface AlphabetGridProps {
  /** 문서에 실제로 존재하는 알파벳 섹션 */
  available: Set<string>
  activeLetter: string
  onJump: (id: string) => void
}

/** 데스크톱 용어집 색인의 A~Z 격자. 항목이 없는 글자는 눌리지 않는다. */
export function AlphabetGrid({ available, activeLetter, onJump }: AlphabetGridProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
        <span>알파벳 바로가기</span>
        {activeLetter && (
          <span className="font-mono text-[10px] font-bold text-zinc-900 dark:text-zinc-100">
            현재: {activeLetter}
          </span>
        )}
      </div>
      <div className="grid grid-cols-6 gap-1">
        {ALL_ALPHABETS.map((letter) => {
          const hasEntry = available.has(letter)
          const isActive = activeLetter === letter

          if (!hasEntry) {
            return (
              <span
                key={letter}
                className="flex h-7 items-center justify-center rounded-md text-[11px] font-medium text-zinc-300 dark:text-zinc-700 cursor-not-allowed select-none"
              >
                {letter}
              </span>
            )
          }

          return (
            <a
              key={letter}
              href={`#${letter.toLowerCase()}`}
              onClick={(e) => {
                e.preventDefault()
                onJump(letter.toLowerCase())
              }}
              title={`알파벳 ${letter} 섹션으로 이동`}
              className={`
                      flex h-7 items-center justify-center rounded-md text-xs font-semibold transition-all cursor-pointer
                      ${
                        isActive
                          ? 'bg-zinc-900 text-white shadow-xs scale-105 dark:bg-zinc-100 dark:text-zinc-950 font-bold'
                          : 'bg-zinc-100/90 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-950 dark:bg-zinc-800/80 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white'
                      }
                    `}
            >
              {letter}
            </a>
          )
        })}
      </div>
    </div>
  )
}
