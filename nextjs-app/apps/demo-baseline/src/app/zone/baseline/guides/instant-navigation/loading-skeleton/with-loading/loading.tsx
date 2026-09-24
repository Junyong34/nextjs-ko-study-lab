import React from 'react'
import { MARKER_ATTR } from '../types'

/**
 * with-loading/page.tsx의 Suspense fallback.
 * 최종 카탈로그(SlowCatalog)와 같은 골격·높이로 그려 교체 시 레이아웃 이동을 줄인다.
 * 정적 UI만 그리므로 production에서는 링크 prefetch 때 미리 받아 둘 수 있다.
 */
export default function CatalogLoading() {
  return (
    <section
      {...{ [MARKER_ATTR]: 'skeleton:with-loading' }}
      aria-busy="true"
      className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <div className="h-5 w-56 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <span className="font-mono text-[11px] text-zinc-500">loading.tsx 스켈레톤 · 서버 대기 중</span>
      </div>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li
            key={i}
            className="h-20 animate-pulse rounded-md border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
          />
        ))}
      </ul>
    </section>
  )
}
