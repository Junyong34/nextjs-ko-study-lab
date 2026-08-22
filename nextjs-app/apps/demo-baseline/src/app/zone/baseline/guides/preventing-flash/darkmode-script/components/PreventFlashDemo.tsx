'use client'
import React, { useState } from 'react'
export function PreventFlashDemo() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">현재 테마: {theme}</span>
        <button type="button" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">테마 토글</button>
      </div>
      <div className="rounded bg-zinc-900 p-3 font-mono text-[11px] text-emerald-400">
        {'<script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add(\'dark\')" }} />'}
      </div>
    </div>
  )
}
