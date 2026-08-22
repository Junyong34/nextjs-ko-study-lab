'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BASE_URL = '/zone/baseline/linking-and-navigating/soft-navigation'

export function NavComparisonBar() {
  const pathname = usePathname()

  const isRoot = pathname === BASE_URL
  const isBest = pathname === `${BASE_URL}/best`
  const isNew = pathname === `${BASE_URL}/new`

  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
        네비게이션 방식 대조 버튼
      </div>

      <div className="flex flex-wrap gap-2">
        {/* 1. Link (scroll={false}) */}
        <Link
          href={`${BASE_URL}/best`}
          scroll={false}
          className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
            isBest
              ? 'bg-emerald-600 text-white font-bold shadow-2xs'
              : 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
          }`}
        >
          <span>베스트 상품</span>
          <span className="rounded bg-emerald-950 px-1 py-0.2 font-mono text-[9px] text-emerald-300">
            &lt;Link scroll=&#123;false&#125;&gt;
          </span>
        </Link>

        {/* 2. Link (기본 스크롤 최상단) */}
        <Link
          href={`${BASE_URL}/new`}
          className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
            isNew
              ? 'bg-emerald-600 text-white font-bold shadow-2xs'
              : 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
          }`}
        >
          <span>신상품</span>
          <span className="rounded bg-zinc-200 px-1 py-0.2 font-mono text-[9px] text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
            &lt;Link&gt; (기본 스크롤 상단)
          </span>
        </Link>

        {/* 3. Link (추천 상품) */}
        <Link
          href={BASE_URL}
          scroll={false}
          className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
            isRoot
              ? 'bg-emerald-600 text-white font-bold shadow-2xs'
              : 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
          }`}
        >
          <span>추천 상품 (홈)</span>
          <span className="rounded bg-emerald-950 px-1 py-0.2 font-mono text-[9px] text-emerald-300">
            &lt;Link scroll=&#123;false&#125;&gt;
          </span>
        </Link>

        {/* 4. a 태그 (전통적 Hard Navigation) */}
        <a
          href={`${BASE_URL}/best`}
          className="inline-flex items-center gap-1.5 rounded border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-800 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 cursor-pointer"
        >
          <span>베스트 상품 (하드 리로드)</span>
          <span className="rounded bg-rose-200 px-1 py-0.2 font-mono text-[9px] text-rose-900 dark:bg-rose-900 dark:text-rose-200">
            &lt;a href&gt; (Hard Reload)
          </span>
        </a>
      </div>
    </div>
  )
}
