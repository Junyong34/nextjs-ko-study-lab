'use client'

import React from 'react'
import Link from 'next/link'
import { DemoResetButton } from '@study/demo-kit'
import { ROUTES, displayRel, hrefOf } from '../routes'
import { useObservation } from './ObservationContext'

/** 실제 page.tsx가 있는 다섯 경로로 이동하는 Link 목록 */
export function RouteNav() {
  const { currentRel, observations, reset } = useObservation()

  return (
    <nav aria-label="데모 경로" className="flex flex-wrap items-center gap-2">
      {ROUTES.map((r) => {
        const active = currentRel === r.rel
        const seen = Boolean(observations[r.rel])
        return (
          <Link
            key={r.rel}
            href={hrefOf(r.rel)}
            aria-current={active ? 'page' : undefined}
            className={`rounded border px-2.5 py-1 text-xs font-semibold ${
              active
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
            }`}
          >
            {r.label}
            <span className="ml-1 font-mono text-[10px] font-normal opacity-70">
              {displayRel(r.rel)}
              {seen ? ' · 관측됨' : ''}
            </span>
          </Link>
        )
      })}
      <DemoResetButton onReset={reset} label="관측 기록 초기화" className="ml-auto" />
    </nav>
  )
}
