'use client'
import React, { useState } from 'react'
export function LazyModalDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <button type="button" onClick={() => setOpen(true)} className="rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 cursor-pointer">
        [결제] 결제 모달 열기 (동적 청크 로드)
      </button>
      {open && (
        <div className="rounded border border-emerald-300 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/40 text-xs">
          <div className="font-bold text-emerald-900 dark:text-emerald-300">결제 모달 마운트 완료 (지연 다운로드 성공)</div>
          <button type="button" onClick={() => setOpen(false)} className="mt-2 text-zinc-500 underline cursor-pointer">닫기</button>
        </div>
      )}
    </div>
  )
}
