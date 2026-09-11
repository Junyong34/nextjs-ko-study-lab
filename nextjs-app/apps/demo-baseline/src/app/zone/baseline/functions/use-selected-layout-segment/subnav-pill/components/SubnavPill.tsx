'use client'

import React from 'react'
import Link from 'next/link'
import { SUBNAV_TABS } from '../types'

/**
 * 실제 Next.js <Link>로 서브 라우트를 이동한다. 활성 탭은 layout.tsx가 호출한
 * useSelectedLayoutSegment()의 반환값(segment prop)과 각 탭의 segment를 비교해 결정한다 —
 * 탭 클릭 상태를 별도 useState로 흉내 내지 않는다.
 */
export function SubnavPill({ segment }: { segment: string | null }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="상품 상세 서브 내비게이션">
      {SUBNAV_TABS.map((tab) => {
        const isActive = tab.segment === segment
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
