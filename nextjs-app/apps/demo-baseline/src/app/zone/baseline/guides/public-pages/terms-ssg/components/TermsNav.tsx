'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PROBE_TARGETS } from '../terms'
import type { TargetKind } from '../types'

const KIND_NOTE: Record<TargetKind, string> = {
  prebuilt: 'generateStaticParams 포함 → ●',
  unknown: '목록 밖 + dynamicParams=false → 404',
  'runtime-api': '같은 목록 + cookies() → ƒ',
}

/** 실제 하위 page로 이동하는 <Link>. 404 대상은 prefetch하지 않고 누르면 앱의 not-found 화면으로 이동한다. */
export function TermsNav() {
  const pathname = usePathname()

  return (
    <nav className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {PROBE_TARGETS.map((t) => {
        const active = pathname === t.href
        return (
          <Link
            key={t.key}
            href={t.href}
            prefetch={t.kind === 'unknown' ? false : undefined}
            aria-current={active ? 'page' : undefined}
            className={`rounded-md border px-3 py-2 text-left transition-colors ${
              active
                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
            }`}
          >
            <span className="block font-mono text-[11px] font-bold">{t.label}</span>
            <span className={`block text-[10px] ${active ? 'opacity-80' : 'text-zinc-500'}`}>{KIND_NOTE[t.kind]}</span>
          </Link>
        )
      })}
    </nav>
  )
}
