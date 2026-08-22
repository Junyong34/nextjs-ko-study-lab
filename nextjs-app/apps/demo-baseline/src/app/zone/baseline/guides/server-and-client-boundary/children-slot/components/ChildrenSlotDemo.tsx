'use client'
import React, { useState } from 'react'

export function ChildrenSlotDemo() {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">클라이언트 슬라이드 토글 상태: {isOpen ? '열림' : '닫힘'}</span>
        <button type="button" onClick={() => setIsOpen(o => !o)} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
          {isOpen ? '슬롯 접기' : '슬롯 펼치기'}
        </button>
      </div>
      {isOpen && (
        <div className="rounded border border-blue-300 bg-blue-50/40 p-4 dark:border-blue-900 dark:bg-blue-950/20 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-blue-950 dark:text-blue-200">[상품] 주입된 Server Component (children)</span>
            <span className="font-mono text-[10px] text-zinc-400">0 KB Bundle</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">이 영역은 클라이언트 컴포넌트의 자식 슬롯으로 주입되어 서버 전용 렌더링 특성을 100% 유지합니다.</p>
        </div>
      )}
    </div>
  )
}
