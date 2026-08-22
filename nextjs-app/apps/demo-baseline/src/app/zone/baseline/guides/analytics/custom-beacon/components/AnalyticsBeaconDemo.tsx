'use client'
import React, { useState } from 'react'
export function AnalyticsBeaconDemo() {
  const [sent, setSent] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <button type="button" onClick={() => setSent(true)} className="rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        {sent ? '[확인] 비콘 전송 완료 (204 No Content)' : '[분석] [구매하기 클릭] 커스텀 비콘 이벤트 전송'}
      </button>
    </div>
  )
}
