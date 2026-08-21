'use client'

import React from 'react'
import { ALL_ALPHABETS } from './config'

export interface MobileAlphabetBarProps {
  available: Set<string>
  activeLetter: string
  onJump: (id: string) => void
}

/** 모바일·태블릿에서 화면 하단에 뜨는 가로 색인 바. 데스크톱에서는 숨는다. */
export function MobileAlphabetBar({
  available,
  activeLetter,
  onJump,
}: MobileAlphabetBarProps) {
  return (
    <div className="xl:hidden fixed bottom-5 left-4 right-20 z-40 flex items-center gap-1 overflow-x-auto rounded-full border border-zinc-200/90 bg-white/95 px-3 py-1.5 shadow-xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 [scrollbar-width:none]">
      <span className="text-[10px] font-bold text-zinc-500 shrink-0 mr-0.5">색인:</span>
      {ALL_ALPHABETS.filter((l) => available.has(l)).map((letter) => {
        const isActive = activeLetter === letter
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
                  flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer
                  ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-950 scale-110'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                  }
                `}
          >
            {letter}
          </a>
        )
      })}
    </div>
  )
}
