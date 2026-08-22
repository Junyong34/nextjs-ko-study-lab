'use client'
import React, { useState } from 'react'
export function ResetRecoveryDemo() {
  const [recovered, setRecovered] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="text-zinc-600 dark:text-zinc-400">에러 바운더리 복구 상태: {recovered ? '[확인] reset() 성공: 정상 화면 복귀' : '에러 대기'}</div>
      <button type="button" onClick={() => setRecovered(true)} className="rounded bg-blue-600 px-3.5 py-1.5 font-bold text-white shadow-2xs cursor-pointer">
        다시 시도 (reset() 호출)
      </button>
    </div>
  )
}
