'use client'
import React, { useState } from 'react'
export function RevalidatePathSyncDemo() {
  const [log, setLog] = useState('대기 중')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">상태: {log}</div>
      <button type="button" onClick={() => setLog('[확인] revalidatePath("/shop") 호출 완료: 상단 배너, 사이드바, 상품 목록 전체 캐시 일괄 퍼지')} className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        revalidatePath('/shop') 실행
      </button>
    </div>
  )
}
