'use client'
import React, { useState } from 'react'

export function SwrMutationDemo() {
  const [qty, setQty] = useState(2)
  const [isUpdating, setIsUpdating] = useState(false)
  const handleAdd = () => {
    setQty(q => q + 1)
    setIsUpdating(true)
    setTimeout(() => setIsUpdating(false), 500)
  }
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">무선 헤드폰 장바구니</span>
        <span className="font-mono text-xs font-bold text-emerald-600">{qty}개 담김 (총 {(qty * 299000).toLocaleString()}원)</span>
      </div>
      <div className="flex items-center justify-between">
        <button type="button" onClick={handleAdd} className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
          + 수량 1개 추가 (mutate 즉시 반영)
        </button>
        {isUpdating && <span className="font-mono text-[11px] text-zinc-400">서버 동기화 중...</span>}
      </div>
    </div>
  )
}
