'use client'
import React, { useState } from 'react'

export function TanstackQueryDemo() {
  const [items, setItems] = useState(['상품 #1 (스마트워치)', '상품 #2 (무선이어폰)', '상품 #3 (게이밍마우스)'])
  const loadMore = () => {
    const nextId = items.length + 1
    setItems(prev => [...prev, `상품 #${nextId} (신규 아이템 ${nextId})`, `상품 #${nextId+1} (신규 아이템 ${nextId+1})`])
  }
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">useInfiniteQuery 상품 목록 ({items.length}건)</span>
        <button type="button" onClick={loadMore} className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-2xs hover:bg-blue-700 cursor-pointer">
          + 다음 페이지 로드
        </button>
      </div>
      <div className="space-y-1.5 font-mono text-xs text-zinc-700 dark:text-zinc-300">
        {items.map((it, idx) => (
          <div key={idx} className="rounded bg-zinc-50 p-2 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">• {it}</div>
        ))}
      </div>
    </div>
  )
}
