'use client'
import React, { useState } from 'react'
export function OndemandSyncDemo() {
  const [tagStatus, setTagStatus] = useState('캐시 유효 (Fresh)')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">태그 상태: {tagStatus}</div>
      <button type="button" onClick={() => setTagStatus('[즉시] revalidateTag 즉시 만료됨 -> 신규 데이터 재계산')} className="rounded bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 cursor-pointer">
        revalidateTag("products") 즉시 무효화
      </button>
    </div>
  )
}
