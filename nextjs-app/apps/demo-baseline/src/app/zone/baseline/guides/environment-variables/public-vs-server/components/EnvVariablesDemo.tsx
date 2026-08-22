'use client'
import React from 'react'
export function EnvVariablesDemo() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-mono">
      <div className="rounded border border-blue-200 bg-blue-50/50 p-3 dark:border-blue-950 dark:bg-blue-950/20">
        <div className="font-bold text-blue-900 dark:text-blue-300">NEXT_PUBLIC_API_URL:</div>
        <div className="text-zinc-600 dark:text-zinc-400 mt-1">https://api.shop.com (클라이언트 노출 허용)</div>
      </div>
      <div className="rounded border border-rose-200 bg-rose-50/50 p-3 dark:border-rose-950 dark:bg-rose-950/20">
        <div className="font-bold text-rose-900 dark:text-rose-300">PAYMENT_SECRET_KEY:</div>
        <div className="text-zinc-600 dark:text-zinc-400 mt-1">sk_live_*** (서버 전용, 번들 유출 0%)</div>
      </div>
    </div>
  )
}
