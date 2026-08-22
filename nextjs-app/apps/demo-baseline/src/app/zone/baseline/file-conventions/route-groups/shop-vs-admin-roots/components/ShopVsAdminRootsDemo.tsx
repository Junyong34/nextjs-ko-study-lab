'use client'
import React from 'react'
export function ShopVsAdminRootsDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
      <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-950 dark:bg-blue-950/20">
        <div className="font-bold text-blue-900 dark:text-blue-300">app/(shop)/layout.tsx</div>
        <div className="text-zinc-500 mt-1">쇼핑몰 전용 GNB & 장바구니 헤더</div>
      </div>
      <div className="rounded border border-purple-200 bg-purple-50/50 p-3 dark:border-purple-950 dark:bg-purple-950/20">
        <div className="font-bold text-purple-900 dark:text-purple-300">app/(admin)/layout.tsx</div>
        <div className="text-zinc-500 mt-1">어드민 사이드바 & 통계 대시보드 헤더</div>
      </div>
    </div>
  )
}
