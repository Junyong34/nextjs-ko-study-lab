'use client'
import React, { useState, useTransition } from 'react'

export function StartTransitionDemo() {
  const [isPending, startTransition] = useTransition()
  const [selected, setSelected] = useState('전체')
  const handleChange = (val: string) => {
    setSelected(val)
    startTransition(async () => {
      await new Promise(r => setTimeout(r, 600))
    })
  }
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">카테고리 선택:</span>
        {isPending && <span className="font-mono text-blue-500 animate-pulse font-bold">서버 트랜지션 처리 중...</span>}
      </div>
      <div className="flex gap-2">
        {['전체', '전자기기', '의류', '도서'].map(cat => (
          <button key={cat} type="button" onClick={() => handleChange(cat)} className={`rounded px-3 py-1 text-xs font-bold ${selected === cat ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
