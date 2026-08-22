'use client'
import React, { useState } from 'react'
export function MultiFilterWidgetDemo() {
  const [selected, setSelected] = useState<string[]>([])
  const toggle = (tag: string) => {
    setSelected(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">선택된 복합 필터: {selected.join(', ') || '(전체)'}</div>
      <div className="flex gap-2 text-xs">
        {['무료배송', '당일발송', '쿠폰적용가능', '재고있음'].map(tag => (
          <button key={tag} type="button" onClick={() => toggle(tag)} className={`rounded px-2.5 py-1 font-medium ${selected.includes(tag) ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
