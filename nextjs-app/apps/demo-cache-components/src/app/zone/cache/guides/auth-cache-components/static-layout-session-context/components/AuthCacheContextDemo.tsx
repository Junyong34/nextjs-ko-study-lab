'use client'
import React, { useState } from 'react'

export function AuthCacheContextDemo() {
  const [user] = useState({ name: '홍길동 고객님', tier: 'VIP 골드' })
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded border border-emerald-300 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-1">
        <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200">1. 공통 상품 레이아웃 ('use cache')</span>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">모든 사용자에게 0ms로 서빙되는 캐시된 상품 스펙</p>
      </div>
      <div className="rounded border border-blue-300 bg-blue-50/50 p-4 dark:border-blue-950 dark:bg-blue-950/20 space-y-1">
        <span className="text-xs font-bold text-blue-950 dark:text-blue-200">2. 개인화 세션 슬롯 (Client Context)</span>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">{user.name} ({user.tier})</p>
      </div>
    </div>
  )
}
