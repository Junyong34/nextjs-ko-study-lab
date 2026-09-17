'use client'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePrefetchObservation } from '../hooks/usePrefetchObservation'
import type { PrefetchCounts } from '../types'

export const AUTO_HREF = '/zone/baseline/file-conventions/dynamic-segments/single-param/items/PROD-001'
export const DISABLED_HREF = '/zone/baseline/file-conventions/dynamic-segments/single-param/items/PROD-002'

interface PrefetchModesDemoProps {
  isDev: boolean
  onObserve: (counts: PrefetchCounts) => void
}

export function PrefetchModesDemo({ isDev, onObserve }: PrefetchModesDemoProps) {
  const counts = usePrefetchObservation({ autoHref: AUTO_HREF, disabledHref: DISABLED_HREF })

  useEffect(() => {
    onObserve(counts)
  }, [counts, onObserve])

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between rounded border border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] dark:border-zinc-800 dark:bg-zinc-900/50">
        <span className="text-zinc-500">현재 실행 모드</span>
        <span
          className={`rounded px-2 py-0.5 font-mono font-bold ${
            isDev
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          }`}
        >
          {isDev ? 'development (pnpm dev)' : 'production (pnpm build && pnpm start)'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
        <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900">
          <div className="font-bold text-blue-900 dark:text-blue-200">
            <Link href={AUTO_HREF}>상품 상세 (prefetch prop 미지정)</Link>
          </div>
          <div className="mt-1 text-zinc-500">뷰포트 진입 즉시 Next.js가 자동으로 prefetch를 시도합니다.</div>
          <div className="mt-2 font-mono text-[11px]">
            실제 관찰된 prefetch 요청:{' '}
            <span className="font-bold text-blue-700 dark:text-blue-300">{counts.autoCount}건</span>
          </div>
        </div>
        <div className="rounded border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900">
          <div className="font-bold text-amber-900 dark:text-amber-200">
            <Link href={DISABLED_HREF} prefetch={false}>
              상품 상세 (prefetch={'{'}false{'}'})
            </Link>
          </div>
          <div className="mt-1 text-zinc-500">
            마우스를 올려도 자동 요청이 발생하지 않습니다 — 직접 호버해서 아래 수치가 그대로인지 확인하세요.
          </div>
          <div className="mt-2 font-mono text-[11px]">
            실제 관찰된 prefetch 요청:{' '}
            <span className="font-bold text-amber-700 dark:text-amber-300">{counts.disabledCount}건</span>
          </div>
        </div>
      </div>

      <div className="rounded bg-zinc-900 p-2 font-mono text-[11px] text-zinc-300">
        위 수치는 <code>performance.getEntriesByType(&apos;resource&apos;)</code>가 실제로 기록한{' '}
        <code>?_rsc=</code> 요청만 집계한 값입니다. DevTools Network 탭에서 요청 헤더의{' '}
        <code>next-router-prefetch: 1</code>을 직접 대조해 보세요.
      </div>
    </div>
  )
}
