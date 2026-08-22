'use client'
import React, { useState } from 'react'
export function TemplateRemountDemo() {
  const [key, setKey] = useState(1)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">template.tsx 인스턴스 ID: #{key}</span>
        <button type="button" onClick={() => setKey(k => k + 1)} className="rounded bg-purple-600 px-3 py-1 text-xs font-bold text-white cursor-pointer">페이지 전환 (리마운트)</button>
      </div>
      <div key={key} className="rounded bg-purple-50 p-3 text-xs text-purple-950 dark:bg-purple-950/40 dark:text-purple-200 animate-pulse font-mono">
        [확인] 새 템플릿 인스턴스 마운트됨 -&gt; 폼 입력값 및 스크롤 자동 초기화
      </div>
    </div>
  )
}
