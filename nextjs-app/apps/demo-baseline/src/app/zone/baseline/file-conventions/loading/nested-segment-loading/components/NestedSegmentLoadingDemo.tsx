'use client'
import React from 'react'
export function NestedSegmentLoadingDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">GNB / 카테고리 사이드바 (상시 인터랙션 가능)</div>
      <div className="rounded bg-zinc-100 p-4 animate-pulse dark:bg-zinc-800 text-center font-mono text-zinc-500">
        [id]/loading.tsx 세그먼트 스켈레톤 로딩 중...
      </div>
    </div>
  )
}
