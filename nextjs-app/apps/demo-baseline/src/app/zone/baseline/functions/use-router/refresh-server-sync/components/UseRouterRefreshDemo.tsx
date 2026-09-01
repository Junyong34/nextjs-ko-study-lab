'use client'
import React, { useState } from 'react'

export function UseRouterRefreshDemo() {
  const [refreshCount, setRefreshCount] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setRefreshCount(c => c + 1)
      setIsRefreshing(false)
    }, 500)
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">RSC 서버 동기화 횟수: {refreshCount}회</span>
        <button type="button" onClick={handleRefresh} disabled={isRefreshing} className="rounded bg-emerald-600 px-3.5 py-1.5 font-bold text-white disabled:opacity-50 cursor-pointer">
          {isRefreshing ? '갱신 상태 변경 중...' : '[데이터 갱신] 표시 변경'}
        </button>
      </div>
      <p className="text-xs text-zinc-500">버튼을 누르면 로컬 갱신 횟수가 늘어납니다. 실제 router.refresh() 호출은 포함하지 않습니다.</p>
    </div>
  )
}
