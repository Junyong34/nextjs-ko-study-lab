'use client'
import React, { useState } from 'react'
export function SseStockStreamDemo() {
  const [stock, setStock] = useState(12)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">실시간 재고 수량 (SSE 스트림): <strong className="text-rose-600 font-mono">{stock}개 남음</strong></div>
      <button type="button" onClick={() => setStock(s => Math.max(0, s - 1))} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        다른 사용자의 구매 발생 (-1)
      </button>
    </div>
  )
}
