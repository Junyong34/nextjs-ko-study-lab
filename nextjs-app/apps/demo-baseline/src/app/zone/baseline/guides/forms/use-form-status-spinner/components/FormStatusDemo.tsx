'use client'
import React, { useState } from 'react'

export function FormStatusDemo() {
  const [isPending, setIsPending] = useState(false)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setTimeout(() => setIsPending(false), 1200)
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="text-xs text-zinc-600 dark:text-zinc-400">useFormStatus 기반의 독립 제출 버튼 컴포넌트 시뮬레이션</div>
      <button type="submit" disabled={isPending} className="rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50 cursor-pointer">
        {isPending ? '[대기] 주문 처리 중 (1.2s)...' : '[결제] 결제 승인 요청 (useFormStatus)'}
      </button>
    </form>
  )
}
