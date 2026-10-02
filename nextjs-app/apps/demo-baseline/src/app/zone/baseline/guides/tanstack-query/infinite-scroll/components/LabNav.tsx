'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BASE } from '../lib/query'

const LINKS = [
  { href: BASE, label: '상품 목록' },
  { href: `${BASE}/notice`, label: '공지사항 (목록 언마운트)' },
]

/** 실제 라우트 이동. 목록(page.tsx)은 언마운트되지만 layout의 QueryClientProvider와 캐시는 남는다. */
export function LabNav() {
  const pathname = usePathname()
  return (
    <nav className="mb-3 flex gap-1 border-b border-zinc-200 text-xs dark:border-zinc-800">
      {LINKS.map((l) => {
        const active = pathname === l.href
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`-mb-px border-b-2 px-3 py-2 font-semibold ${active ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
          >
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}
