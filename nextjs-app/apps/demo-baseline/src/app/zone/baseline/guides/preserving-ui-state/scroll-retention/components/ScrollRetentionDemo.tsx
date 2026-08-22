'use client'
import React, { useState } from 'react'
export function ScrollRetentionDemo() {
  const [filter, setFilter] = useState('최신순')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">정렬 기준: {filter} (scroll: false 적용됨)</div>
      <div className="flex gap-2 text-xs">
        {['최신순', '인기순', '낮은가격순'].map(f => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded px-3 py-1 font-bold ${filter === f ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>{f}</button>
        ))}
      </div>
    </div>
  )
}
