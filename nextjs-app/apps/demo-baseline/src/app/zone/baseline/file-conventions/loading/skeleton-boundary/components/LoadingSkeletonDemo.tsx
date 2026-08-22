'use client'
import React, { useState } from 'react'

export function LoadingSkeletonDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const simulate = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">loading.tsx 스켈레톤 동작 시뮬레이터</span>
        <button type="button" onClick={simulate} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
          페이지 이동 트리거 (1초 로딩)
        </button>
      </div>
      {isLoading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-zinc-200 rounded w-1/3 dark:bg-zinc-800" />
          <div className="h-20 bg-zinc-200 rounded dark:bg-zinc-800" />
        </div>
      ) : (
        <div className="rounded bg-zinc-50 p-4 text-xs dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          [확인] 로드 완료된 상품 본문: 4K 144Hz 게이밍 모니터 (650,000원)
        </div>
      )}
    </div>
  )
}
