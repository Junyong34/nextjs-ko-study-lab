'use client'
import React, { useState } from 'react'

export function AfterBackgroundLoggingDemo() {
  const [status, setStatus] = useState('주문 대기')

  const handleOrder = () => {
    setStatus('[확인] 주문 응답 완료 (0ms 즉시 반환) -> after()로 결제 로그 백그라운드 기록 중')
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-semibold text-zinc-700 dark:text-zinc-300">상태: {status}</div>
      <button type="button" onClick={handleOrder} className="rounded bg-emerald-600 px-4 py-2 font-bold text-white shadow-2xs cursor-pointer">
        [결제] 주문 완료 및 after() 백그라운드 실행
      </button>
    </div>
  )
}
