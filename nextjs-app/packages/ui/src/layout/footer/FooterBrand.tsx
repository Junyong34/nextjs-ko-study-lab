import React from 'react'
import { NextLogo } from '../../brand'

/** 푸터 좌측의 로고 + 서비스명 + 한 줄 소개. */
export function FooterBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200/80 bg-white p-1.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <NextLogo className="h-3.5 w-auto text-zinc-950 dark:text-zinc-50" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Next.js 학습</span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          App Router 공식 문서 한국어 가이드 &amp; 실습 데모
        </span>
      </div>
    </div>
  )
}
