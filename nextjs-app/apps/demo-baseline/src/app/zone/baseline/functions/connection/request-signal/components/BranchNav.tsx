'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BASE = '/zone/baseline/functions/connection/request-signal'

const TABS = [
  { href: BASE, label: '개요' },
  { href: `${BASE}/static-branch`, label: '정적 브랜치 (미사용)' },
  { href: `${BASE}/dynamic-branch`, label: 'connection() 브랜치' },
]

/**
 * 실제 Next.js <Link>로 물리적 서브 라우트(static-branch, dynamic-branch)를 이동한다.
 * 탭 활성 상태는 usePathname()이 반환하는 실제 현재 경로와 비교해 결정한다 — useState로
 * 탭 전환을 흉내 내지 않는다.
 */
export function BranchNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap gap-2" aria-label="connection() 브랜치 비교 내비게이션">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded px-2.5 py-1 text-xs font-semibold ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
