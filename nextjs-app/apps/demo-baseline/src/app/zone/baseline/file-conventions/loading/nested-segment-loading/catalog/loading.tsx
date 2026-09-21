'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLoadingObservation } from '../components/LoadingObservation'
import { NESTED_LOADING_BASE_PATH } from '../types'

const RUN_PATTERN = new RegExp(`^${NESTED_LOADING_BASE_PATH}/catalog/([^/]+)`)

/**
 * catalog/[run]/layout.tsx + catalog/[run]/page.tsx를 함께 감싸는 상위 Suspense 경계 [A].
 * loading.tsx는 params를 받지 않으므로(공식 문서 참조), 현재 목표 경로에서 run 값을 직접 읽는다.
 */
export default function CatalogLoading() {
  const pathname = usePathname()
  const { markCatalogFallback } = useLoadingObservation()

  useEffect(() => {
    const runId = pathname.match(RUN_PATTERN)?.[1]
    if (runId) markCatalogFallback(runId)
  }, [pathname, markCatalogFallback])

  return (
    <div className="min-w-0 animate-pulse space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 rounded bg-zinc-100 dark:bg-zinc-900" />
        ))}
      </div>
      <div className="text-center font-mono text-[11px] text-zinc-400">
        [A] catalog/loading.tsx — 카탈로그 레이아웃·목록 상위 fallback 표시 중...
      </div>
    </div>
  )
}
