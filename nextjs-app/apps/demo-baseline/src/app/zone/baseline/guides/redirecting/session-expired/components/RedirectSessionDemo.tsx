'use client'
import React, { useState, useTransition } from 'react'
import { expireSessionAction } from '../actions'

export function RedirectSessionDemo() {
  const [target, setTarget] = useState('결제 진행 중')
  const [isPending, startTransition] = useTransition()

  const handleExpire = () => {
    setTarget('세션 만료 처리 중 -> redirect() 호출 예정')
    startTransition(async () => {
      await expireSessionAction()
    })
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">현재 상태: {target}</div>
      <button
        type="button"
        onClick={handleExpire}
        disabled={isPending}
        className="rounded bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
      >
        세션 만료 시뮬레이션
      </button>
    </div>
  )
}
