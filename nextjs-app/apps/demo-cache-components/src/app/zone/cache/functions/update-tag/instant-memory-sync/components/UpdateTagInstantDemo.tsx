'use client'
import React, { useState } from 'react'

export function UpdateTagInstantDemo() {
  const [qty, setQty] = useState(3)

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">장바구니 수량: {qty}개 (클라이언트 상태)</div>
      <button type="button" onClick={() => setQty(q => q + 1)} className="rounded bg-emerald-600 px-3.5 py-1.5 font-bold text-white cursor-pointer">
        수량 1개 늘리기
      </button>
    </div>
  )
}
