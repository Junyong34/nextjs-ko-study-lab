'use client'
import React, { useState } from 'react'

export function NestedLayoutDemo() {
  const [tab, setTab] = useState('의류')
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">루트 GNB (고정 레이아웃)</span>
        <span className="font-mono text-[10px] text-zinc-400">root layout.tsx</span>
      </div>
      <div className="flex gap-2">
        {['의류', '전자기기', '식품'].map(t => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded px-3 py-1 text-xs font-bold ${tab === t ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800'}`}>
            {t} 탭 전환 (중첩)
          </button>
        ))}
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        현재 활성화된 카테고리 본문: <strong className="text-blue-600 dark:text-blue-400">{tab} 상품 목록 페이지 (page.tsx)</strong>
      </div>
    </div>
  )
}
