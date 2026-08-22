'use client'
import React, { useState } from 'react'

export function RedirectOrderDemo() {
  const [status, setStatus] = useState('주문 결제 대기 중')
  const handlePay = () => {
    setStatus('결제 승인 완료 -> redirect(/order/complete) 발동!')
  }
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">상태: {status}</div>
      <button type="button" onClick={handlePay} className="rounded bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 cursor-pointer">
        [결제] 219,000원 결제 및 완료 페이지 이동 (redirect)
      </button>
    </div>
  )
}
