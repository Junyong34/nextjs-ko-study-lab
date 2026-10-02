'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { useStaleTimesLab } from './StaleTimesProvider'
import { ROUTES, ROUTE_LABEL, routeFromPath, routeHref } from '../types'

const BUTTON =
  'rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900'

/** layout에 있어 하위 page 이동 중에도 유지되는 조작부. prefetch 기본값의 <Link>를 그대로 쓴다. */
export function NavPanel() {
  const pathname = usePathname()
  const { begin, reset } = useStaleTimesLab()
  const current = routeFromPath(pathname)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-semibold text-zinc-500">&lt;Link&gt; 이동</span>
      {ROUTES.map((route) =>
        route === current ? (
          <span key={route} className={`${BUTTON} cursor-default bg-zinc-100 text-zinc-500 dark:bg-zinc-900`}>
            현재: {ROUTE_LABEL[route]}
          </span>
        ) : (
          <Link key={route} href={routeHref(route)} onClick={() => begin(route)} className={BUTTON}>
            {ROUTE_LABEL[route]}로 이동 →
          </Link>
        ),
      )}
      <DemoResetButton label="이동 기록 초기화" onReset={reset} />
    </div>
  )
}
