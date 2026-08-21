import React from 'react'
import { ChevronRight } from 'lucide-react'

export interface DetailsProps {
  summary: string
  children: React.ReactNode
}

/**
 * `<details>`와 `<summary>`를 렌더링하는 접기/펼치기 아코디언 컴포넌트입니다.
 * 마크다운 문서의 연습 문제 정답 및 해설을 기본적으로 접어두고,
 * 클릭 시 부드러운 화살표 회전과 함께 내용을 열람할 수 있도록 지원합니다.
 */
export function Details({ summary, children }: DetailsProps) {
  return (
    <details className="group my-4 overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-50/50 shadow-xs transition-colors dark:border-zinc-800 dark:bg-zinc-900/40">
      <summary className="flex cursor-pointer select-none items-center gap-2 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100/70 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-300 dark:hover:bg-zinc-800/60 [&::-webkit-details-marker]:hidden">
        <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-90 dark:text-zinc-500" />
        <span>{summary || '정답 보기'}</span>
      </summary>
      <div className="border-t border-zinc-200/60 bg-white/60 px-4 py-3.5 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-300">
        {children}
      </div>
    </details>
  )
}
