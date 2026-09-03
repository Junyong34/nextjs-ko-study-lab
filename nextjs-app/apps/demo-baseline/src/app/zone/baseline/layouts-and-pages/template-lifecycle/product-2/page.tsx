import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'layouts-and-pages/template-lifecycle/product-2')

import React from 'react'

export default function TemplateLifecycleProduct2Page() {
  return (
    <div className="space-y-2 rounded-xl border border-zinc-300/80 bg-white p-5 shadow-xs dark:border-zinc-700/80 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5 dark:border-zinc-800">
        <span className="rounded-md bg-zinc-100 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          product-2/page.tsx (오버핏 기모 맨투맨 라우트)
        </span>
        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
          49,000원
        </span>
      </div>
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 pt-1">
        오버핏 기모 맨투맨
      </h3>
      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
        포근한 기모 안감과 자연스러운 실루엣을 자랑하는 데일리 맨투맨입니다. 페이지가 전환되면서 template.tsx 영역이 새 인스턴스로 리셋되었습니다.
      </p>
    </div>
  )
}
