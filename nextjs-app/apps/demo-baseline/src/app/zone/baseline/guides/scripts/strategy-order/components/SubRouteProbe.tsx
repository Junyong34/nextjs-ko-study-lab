'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { useProbeStore } from '../hooks/useProbeStore'
import { ExecutionTimeline } from './ExecutionTimeline'
import { RouteScopeTable } from './RouteScopeTable'

/** 하위 라우트에서 같은 전역 실측 로그를 그대로 보여준다. 이 페이지 자체에는 page 스크립트가 없다. */
export function SubRouteProbe({ note }: { note: string }) {
  const store = useProbeStore()
  const pathname = usePathname()

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-600 dark:text-zinc-400">{note}</p>
      <RouteScopeTable store={store} currentPath={pathname} />
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-1.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">실측 타임라인 (루트 페이지와 같은 전역 로그)</div>
        <ExecutionTimeline store={store} />
      </div>
    </div>
  )
}
