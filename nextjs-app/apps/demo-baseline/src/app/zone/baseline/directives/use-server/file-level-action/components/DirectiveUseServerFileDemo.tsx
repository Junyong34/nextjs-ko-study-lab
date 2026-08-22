'use client'
import React, { useState } from 'react'

export function DirectiveUseServerFileDemo() {
  const [res, setRes] = useState('')

  const handleAction = async () => {
    setRes('Server Action RPC 호출 성공 -> DB 트랜잭션 완료')
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-mono text-zinc-600 dark:text-zinc-400">결과: {res || '대기 중'}</div>
      <button type="button" onClick={handleAction} className="rounded bg-emerald-600 px-3.5 py-1.5 font-bold text-white cursor-pointer">
        모듈 Server Action 호출 (actions.ts)
      </button>
    </div>
  )
}
