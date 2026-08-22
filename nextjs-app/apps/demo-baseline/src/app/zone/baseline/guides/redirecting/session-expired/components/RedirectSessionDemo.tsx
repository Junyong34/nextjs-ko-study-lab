'use client'
import React, { useState } from 'react'
export function RedirectSessionDemo() {
  const [target, setTarget] = useState('결제 진행 중')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">현재 상태: {target}</div>
      <button type="button" onClick={() => setTarget('307 Redirect 발동 -> /login?returnUrl=/checkout')} className="rounded bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-rose-700 cursor-pointer">
        세션 만료 시뮬레이션
      </button>
    </div>
  )
}
