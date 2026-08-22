'use client'
import React, { useState } from 'react'
export function PgSdkOnloadDemo() {
  const [sdkReady, setSdkReady] = useState(true)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">결제 SDK 상태: {sdkReady ? '[확인] PG사 결제 모듈 준비 완료 (onLoad)' : '로딩 중...'}</div>
      <button type="button" disabled={!sdkReady} className="rounded bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-2xs cursor-pointer">
        안전 결제창 열기
      </button>
    </div>
  )
}
