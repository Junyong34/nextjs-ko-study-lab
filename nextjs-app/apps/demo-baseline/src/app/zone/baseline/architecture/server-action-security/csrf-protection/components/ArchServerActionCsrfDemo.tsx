'use client'
import React from 'react'

export function ArchServerActionCsrfDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">Server Action CSRF 방어:</div>
      <div className="text-zinc-500">• Origin: https://shop.com == Host: shop.com (일치)</div>
      <div className="text-emerald-600">[확인] 검증 통과: 200 OK Server Action RPC 실행</div>
    </div>
  )
}
