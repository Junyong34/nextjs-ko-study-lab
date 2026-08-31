'use client'
import React from 'react'
import Link from 'next/link'

interface PrefetchModesDemoProps {
  hoverCount: number
  onHover: () => void
}

export function PrefetchModesDemo({ hoverCount, onHover }: PrefetchModesDemoProps) {
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
        <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-900">
          <div className="font-bold text-blue-900 dark:text-blue-200">
            <Link href="/zone/baseline/file-conventions/dynamic-segments/single-param/items/PROD-001">
              상품 상세 (기본값)
            </Link>
          </div>
          <div className="text-zinc-500 mt-1">prefetch prop 미지정 → 뷰포트 진입 시 자동 prefetch (기본 동작)</div>
        </div>
        <div
          onMouseEnter={onHover}
          className="rounded border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900"
        >
          <div className="font-bold text-amber-900 dark:text-amber-200">
            <Link href="/zone/baseline/file-conventions/dynamic-segments/single-param/items/PROD-002" prefetch={false}>
              상품 상세 (prefetch=false)
            </Link>
          </div>
          <div className="text-zinc-500 mt-1">호버 감지: {hoverCount}회 — 자동 prefetch 없음, 클릭 시점에만 요청</div>
        </div>
      </div>
      <div className="rounded bg-zinc-900 p-2 font-mono text-[11px] text-zinc-300">
        두 링크의 실제 prefetch 차이는 브라우저 DevTools Network 탭에서 <code>?_rsc=</code> 요청 발생 시점(뷰포트 진입 즉시 vs 클릭 시점)으로 직접 대조하세요.
      </div>
    </div>
  )
}
