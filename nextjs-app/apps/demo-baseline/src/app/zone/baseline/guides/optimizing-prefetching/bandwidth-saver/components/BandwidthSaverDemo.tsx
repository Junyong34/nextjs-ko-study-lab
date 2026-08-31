'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const CATALOG_IDS = Array.from({ length: 12 }, (_, i) => `PROD-${String(i + 1).padStart(3, '0')}`)

interface BandwidthSaverDemoProps {
  optimized: boolean
  onToggle: (v: boolean) => void
  hoverCount: number
  onHover: () => void
}

export function BandwidthSaverDemo({ optimized, onToggle, hoverCount, onHover }: BandwidthSaverDemoProps) {
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">대규모 카탈로그 (12개 링크)</span>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={optimized} onChange={(e) => onToggle(e.target.checked)} />
          최적화 모드(prefetch=false) 적용
        </label>
      </div>
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
        {CATALOG_IDS.map((id) => (
          <Link
            key={id}
            href={`/zone/baseline/file-conventions/dynamic-segments/single-param/items/${id}`}
            prefetch={optimized ? false : undefined}
            onMouseEnter={optimized ? onHover : undefined}
            className="rounded border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-center font-mono text-[11px] hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
          >
            {id}
          </Link>
        ))}
      </div>
      <div className="rounded bg-zinc-900 p-2 font-mono text-[11px] text-zinc-300">
        모드: {optimized ? 'prefetch={false} (호버 시점 온디맨드)' : 'prefetch 기본값 (뷰포트 진입 즉시)'}
        {optimized && ` · 호버 감지: ${hoverCount}회`}
        <br />
        실제 요청 수/용량 차이는 브라우저 Network 탭에서 두 모드를 각각 스크롤해 직접 대조하세요.
      </div>
    </div>
  )
}
