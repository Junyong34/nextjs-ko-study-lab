'use client'

import React, { useState, useEffect } from 'react'

export function PersistentHeader() {
  const [memo, setMemo] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [mountedAt] = useState<string>(() => new Date().toLocaleTimeString())

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-900 p-3.5 text-white dark:border-zinc-800 dark:bg-zinc-950 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-emerald-400">
            Client Navigation Monitor
          </span>
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-300">
            마운트: {mountedAt}
          </span>
          <span className="rounded bg-emerald-950 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300 border border-emerald-800">
            유지 시간: {seconds}초
          </span>
        </div>
        <span className="text-[11px] text-zinc-400">
          Next.js {'<'}Link{'>'}는 브라우저 전체 새로고침 없이 전환됩니다.
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모 작성 후 아래 링크를 클릭해 보세요"
          className="flex-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-hidden"
        />
        <span className="rounded bg-zinc-800 px-2 py-1 font-mono text-[10px] text-zinc-400 border border-zinc-700">
          Soft Navigation 시 보존됨
        </span>
      </div>
    </div>
  )
}
