'use client'
import React, { useState } from 'react'
export function ParallelConditionalDemo() {
  const [role, setRole] = useState<'admin' | 'user'>('admin')
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex gap-2 text-xs">
        <button type="button" onClick={() => setRole('admin')} className="rounded bg-purple-600 px-3 py-1 font-bold text-white cursor-pointer">어드민 슬롯 렌더</button>
        <button type="button" onClick={() => setRole('user')} className="rounded bg-blue-600 px-3 py-1 font-bold text-white cursor-pointer">고객 슬롯 렌더</button>
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 font-mono">
        주입된 슬롯: {role === 'admin' ? '@adminDashboard (정산 및 시스템 제어)' : '@userDashboard (내 주문 및 쿠폰)'}
      </div>
    </div>
  )
}
