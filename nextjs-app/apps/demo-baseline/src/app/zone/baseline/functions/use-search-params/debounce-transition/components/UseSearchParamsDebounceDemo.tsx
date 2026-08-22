'use client'
import React, { useState, useTransition } from 'react'

export function UseSearchParamsDebounceDemo() {
  const [text, setText] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleInput = (val: string) => {
    setText(val)
    startTransition(() => {
      // URL 동기화 트랜지션
    })
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div>
        <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">상품 실시간 검색 (트랜지션 디바운스):</label>
        <input type="text" value={text} onChange={e => handleInput(e.target.value)} placeholder="상품명을 입력하세요 (예: 맥북, 모니터)" className="mt-1 w-full rounded border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      </div>
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-500">동기화된 검색어: "{text || '전체'}"</span>
        {isPending && <span className="text-blue-500 font-bold animate-pulse">트랜지션 갱신 중...</span>}
      </div>
    </div>
  )
}
