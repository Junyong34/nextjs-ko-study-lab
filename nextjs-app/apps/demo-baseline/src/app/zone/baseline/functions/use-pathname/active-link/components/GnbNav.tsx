'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { BASE_PATH, NAV_ITEMS } from '../types'

/**
 * 실제 Next.js <Link>로 서브 라우트를 이동하고, usePathname()이 반환하는 실제 경로와
 * 각 탭의 href를 비교해 활성 스타일을 입힌다. 활성 탭을 별도 state로 흉내 내지 않는다.
 */
export function GnbNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <nav className="flex flex-wrap gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                    : 'text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        <DemoResetButton
          label="홈으로 초기화"
          onReset={() => router.push(BASE_PATH)}
        />
      </div>

      {/* usePathname() 실측값 인스펙터 — 시뮬레이션 값 없이 훅의 실제 반환값만 표시 */}
      <div className="rounded border border-zinc-200 bg-zinc-950 px-3.5 py-2 font-mono text-[11px] text-zinc-300 dark:border-zinc-800">
        usePathname() 반환값: <span className="text-blue-300">&quot;{pathname}&quot;</span>
      </div>
    </div>
  )
}
