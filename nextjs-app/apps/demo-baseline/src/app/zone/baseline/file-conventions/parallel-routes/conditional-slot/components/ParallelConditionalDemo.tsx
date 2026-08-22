'use client'
import React from 'react'

export function ParallelConditionalDemo() {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">권한별 병렬 슬롯 (@admin / @user) 분기</h4>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              @admin / @user 슬롯 온디스크 생성 완료
            </span>
          </div>
          <p className="text-xs text-zinc-500">동일 레이아웃에서 <code>@admin/page.tsx</code>와 <code>@user/page.tsx</code> 슬롯이 독립적으로 병렬 렌더링됩니다.</p>
        </div>
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2">
        <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          병렬 슬롯 아키텍처 안내
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          하단 그리드에 렌더링된 두 영역은 <code>ConditionalSlotLayout</code>에 각각 <code>admin</code>과 <code>user</code> props로 주입된 실제 Next.js 병렬 슬롯 파일(<code>@admin/page.tsx</code>, <code>@user/page.tsx</code>)입니다.
        </p>
      </div>
    </div>
  )
}
