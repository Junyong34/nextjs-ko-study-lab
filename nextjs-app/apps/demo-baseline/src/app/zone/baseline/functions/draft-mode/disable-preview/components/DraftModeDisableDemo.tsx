'use client'
import React, { useState } from 'react'

export function DraftModeDisableDemo() {
  const [isDraft, setIsDraft] = useState(true)

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">상태: {isDraft ? '미리보기 모드 가동 중' : '정적 캐시 모드로 복귀 완료'}</div>
      <button type="button" onClick={() => setIsDraft(false)} className="rounded bg-zinc-900 px-3.5 py-1.5 font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        draftMode().disable() 실행 (미리보기 닫기)
      </button>
    </div>
  )
}
