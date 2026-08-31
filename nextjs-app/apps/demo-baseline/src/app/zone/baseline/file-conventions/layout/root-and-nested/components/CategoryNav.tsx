'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRootNested } from './RootNestedContext'

const BASE = '/zone/baseline/file-conventions/layout/root-and-nested'
const CATEGORIES = [
  { href: BASE, label: '의류' },
  { href: `${BASE}/electronics`, label: '전자기기' },
  { href: `${BASE}/food`, label: '식품' },
]

export function CategoryNav() {
  const pathname = usePathname()
  const { clickCount, increment } = useRootNested()

  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">루트 GNB (layout.tsx 소유, 리마운트 없음)</span>
        <button
          type="button"
          onClick={increment}
          className="rounded bg-zinc-900 px-2.5 py-1 text-[11px] font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
        >
          카운터 +1 (현재: {clickCount})
        </button>
      </div>
      <div className="flex gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`rounded px-3 py-1 text-xs font-bold cursor-pointer ${
              pathname === c.href ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800'
            }`}
          >
            {c.label} 탭 전환 (중첩)
          </Link>
        ))}
      </div>
    </div>
  )
}
