'use client'
import React, { useState } from 'react'
export function LayoutStatePreserveDemo() {
  const [text, setText] = useState('검색창 입력 유지')
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
      <label className="block text-xs font-bold text-zinc-900 dark:text-zinc-100">레이아웃 전역 검색창:</label>
      <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full rounded border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" />
      <p className="text-[11px] text-zinc-500">하위 탭을 이동해도 이 인풋의 입력값은 초기화되지 않습니다.</p>
    </div>
  )
}
