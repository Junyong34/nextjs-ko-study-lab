'use client'
import React, { useState } from 'react'

export function NotFoundDemo() {
  const [id, setId] = useState('101')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setId('101')} className={`rounded px-3 py-1 font-bold ${id === '101' ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>정상 상품 (#101)</button>
        <button type="button" onClick={() => setId('999')} className={`rounded px-3 py-1 font-bold ${id === '999' ? 'bg-rose-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>미등록 상품 (#999 -&gt; 404)</button>
      </div>
      {id === '101' ? (
        <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          상품명: 프리미엄 기계식 키보드 (재고 15개)
        </div>
      ) : (
        <div className="rounded border border-rose-300 bg-rose-50/50 p-4 text-center text-xs text-rose-900 dark:border-rose-900 dark:bg-rose-950/20 dark:text-rose-300">
          [주의]️ 404 Not Found: 요청하신 #999번 상품을 찾을 수 없습니다. (not-found.tsx 렌더)
        </div>
      )}
    </div>
  )
}
