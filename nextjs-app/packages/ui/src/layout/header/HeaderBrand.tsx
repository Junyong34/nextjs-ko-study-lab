import React from 'react'
import Link from 'next/link'
import { NextLogo } from '../../brand'

export interface HeaderBrandProps {
  /** 화면에 표시할 기준 버전 (예: "v16.3.2") */
  version: string
}

/** 헤더 좌측의 로고 + 서비스명 + 기준 버전 배지. */
export function HeaderBrand({ version }: HeaderBrandProps) {
  return (
    <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
      <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200/80 bg-zinc-50/80 p-1.5 sm:p-2 shadow-xs transition group-hover:border-zinc-300 group-hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:border-zinc-700">
        <NextLogo className="h-3.5 sm:h-4 w-auto text-zinc-950 dark:text-zinc-50" />
      </div>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
            Next.js 학습
          </span>
          <span className="inline-flex shrink-0 items-center rounded-md border border-zinc-200 bg-zinc-100/90 px-1 sm:px-1.5 py-0.2 text-[9px] sm:text-[10px] font-mono font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
            {version}
          </span>
        </div>
        <span className="hidden sm:block text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
          App Router 문서 & 데모 실습
        </span>
      </div>
    </Link>
  )
}
