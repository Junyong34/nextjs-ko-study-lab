'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLoadingObservation } from '../../../components/LoadingObservation'
import { NESTED_LOADING_BASE_PATH } from '../../../types'

const PRODUCT_PATTERN = new RegExp(`^${NESTED_LOADING_BASE_PATH}/catalog/([^/]+)/([^/]+)$`)

/**
 * catalog/[run]/[product]/page.tsx 하나만 감싸는 하위 Suspense 경계 [B].
 * catalog/[run]/layout.tsx는 이 경계 바깥에서 이미 커밋되어 있으므로 계속 인터랙티브하다.
 */
export default function ProductLoading() {
  const pathname = usePathname()
  const { markProductFallback } = useLoadingObservation()

  useEffect(() => {
    const match = pathname.match(PRODUCT_PATTERN)
    const runId = match?.[1]
    const productId = match?.[2]
    if (runId && productId) markProductFallback(runId, productId)
  }, [pathname, markProductFallback])

  return (
    <div className="min-w-0 animate-pulse space-y-2 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="h-24 w-full max-w-sm rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="text-center font-mono text-[11px] text-zinc-400">
        [B] catalog/[run]/[product]/loading.tsx — 상품 상세만 격리된 fallback 표시 중...
        <br />
        (위 GNB의 [상위 조작]을 지금 눌러보세요)
      </div>
    </div>
  )
}
