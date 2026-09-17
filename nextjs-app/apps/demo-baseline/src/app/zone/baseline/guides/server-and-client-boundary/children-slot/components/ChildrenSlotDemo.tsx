'use client'
import React, { useRef, useState } from 'react'

export interface ChildrenSlotDemoProps {
  children: React.ReactNode
}

export function ChildrenSlotDemo({ children }: ChildrenSlotDemoProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [rerenderCount, setRerenderCount] = useState(0)
  const initialChildrenRef = useRef(children)
  const identityPreserved = initialChildrenRef.current === children

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">클라이언트 리렌더링 횟수: {rerenderCount}회</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setRerenderCount(c => c + 1)}
            className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
          >
            리렌더링 트리거
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(o => !o)}
            className="rounded border border-zinc-300 px-3 py-1 text-xs font-bold text-zinc-700 dark:border-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            {isOpen ? '슬롯 접기' : '슬롯 펼치기'}
          </button>
        </div>
      </div>
      {isOpen && children}
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
        children 참조 동일성: {identityPreserved ? '유지됨 (RSC 재계산 없음)' : '변경됨'}
      </p>
    </div>
  )
}
