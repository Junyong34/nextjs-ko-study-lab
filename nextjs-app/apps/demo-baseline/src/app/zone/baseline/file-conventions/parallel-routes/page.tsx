import React from 'react'

export default function ParallelRoutesMainPage() {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-1.5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
           쇼핑몰 통합 관제 센터 (메인 children 슬롯)
        </h3>
        <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
          시스템 상태: 정상 가동 중 (99.99%)
        </span>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        하단의 @analytics와 @team 슬롯은 이 메인 페이지와 독립적으로 병렬 렌더링되고 있습니다.
      </p>
    </div>
  )
}
