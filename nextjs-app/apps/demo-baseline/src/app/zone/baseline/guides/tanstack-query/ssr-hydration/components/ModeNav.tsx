'use client'
import React from 'react'
import Link from 'next/link'
import { BASE } from '../lib/deals-query'
import type { DealsVariant } from '../types'

const LINKS: { variant: DealsVariant; href: string; label: string }[] = [
  { variant: 'prefetched', href: BASE, label: '서버 prefetch + HydrationBoundary' },
  { variant: 'client-only', href: `${BASE}/client-only`, label: '대조군: 클라이언트에서만 요청' },
]

export function ModeNav({ current }: { current: DealsVariant }) {
  return (
    <nav className="flex gap-1 border-b border-zinc-200 text-xs dark:border-zinc-800">
      {LINKS.map((l) => (
        <Link
          key={l.variant}
          href={l.href}
          className={`-mb-px border-b-2 px-3 py-2 font-semibold ${l.variant === current ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100' : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  )
}
