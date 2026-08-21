'use client'

import React from 'react'
import { ArrowUp } from 'lucide-react'

/** 목차 하단의 "맨 위로 이동". 원본에서는 용어집용과 일반용으로 두 벌 복붙돼 있었다. */
export function ScrollTopButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="pt-2 border-t border-zinc-200/70 dark:border-zinc-800">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50/80 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition cursor-pointer"
      >
        <ArrowUp className="h-3.5 w-3.5" />
        <span>맨 위로 이동</span>
      </button>
    </div>
  )
}
