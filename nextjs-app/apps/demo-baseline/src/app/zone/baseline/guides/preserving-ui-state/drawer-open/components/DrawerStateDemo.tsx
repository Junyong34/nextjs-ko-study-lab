'use client'
import React, { useState } from 'react'
export function DrawerStateDemo() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">장바구니 드로어 상태: {isDrawerOpen ? '열림' : '닫힘'}</span>
        <button type="button" onClick={() => setIsDrawerOpen(o => !o)} className="rounded bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">토글</button>
      </div>
      <p className="text-xs text-zinc-500">다른 탭으로 이동해도 이 드로어의 열림 상태와 담긴 상품 목록은 유지됩니다.</p>
    </div>
  )
}
