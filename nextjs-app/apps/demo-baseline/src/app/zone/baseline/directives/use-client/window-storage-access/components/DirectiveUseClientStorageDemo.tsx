'use client'
import React, { useState } from 'react'

export function DirectiveUseClientStorageDemo() {
  const [items, setItems] = useState<string[]>(['ITEM-101', 'ITEM-204'])

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">localStorage 최근 본 상품: {items.join(', ')}</div>
      <button type="button" onClick={() => setItems(prev => [...prev, 'ITEM-' + Math.floor(Math.random() * 800 + 100)])} className="rounded bg-zinc-900 px-3 py-1.5 font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        + 최근 본 상품 추가 (localStorage)
      </button>
    </div>
  )
}
