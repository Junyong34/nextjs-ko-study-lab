'use client'
import React, { useState } from 'react'

export function UseRouterPushReplaceDemo() {
  const [history, setHistory] = useState<string[]>(['/shop'])
  const handlePush = (url: string) => setHistory(h => [...h, url])
  const handleReplace = (url: string) => setHistory(h => [...h.slice(0, -1), url])
  const handleBack = () => setHistory(h => h.length > 1 ? h.slice(0, -1) : h)

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap gap-2 text-xs">
        <button type="button" onClick={() => handlePush('/checkout')} className="rounded bg-blue-600 px-3 py-1 font-bold text-white cursor-pointer">router.push('/checkout')</button>
        <button type="button" onClick={() => handleReplace('/order/complete')} className="rounded bg-purple-600 px-3 py-1 font-bold text-white cursor-pointer">router.replace('/order/complete')</button>
        <button type="button" onClick={handleBack} className="rounded bg-zinc-700 px-3 py-1 font-bold text-white cursor-pointer">router.back()</button>
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 font-mono">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">현재 브라우저 히스토리 스택:</span>
        <div className="mt-1 text-blue-600 dark:text-blue-400">{history.join(' -> ')} (현재: {history[history.length - 1]})</div>
      </div>
    </div>
  )
}
