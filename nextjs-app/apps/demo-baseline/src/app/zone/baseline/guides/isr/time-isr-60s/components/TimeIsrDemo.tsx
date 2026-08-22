'use client'
import React, { useState } from 'react'

export function TimeIsrDemo() {
  const [secondsLeft, setSecondsLeft] = useState(60)
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">상품 상세 정적 스냅샷 (#ITEM-8921)</span>
        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">재검증 주기: 60초</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-zinc-500">다음 백그라운드 갱신까지 남은 시간:</span>
        <span className="font-mono font-bold text-emerald-600">{secondsLeft}초 (유효 캐시 상태)</span>
      </div>
    </div>
  )
}
