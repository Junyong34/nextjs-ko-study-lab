'use client'
import React from 'react'

export function HeadersCustomAuthDemo() {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">수신된 HTTP Headers:</div>
      <div className="text-zinc-500">• authorization: Bearer eyJhbGciOi... (유효 토큰)</div>
      <div className="text-emerald-600">[확인] 서버 인증 완료: User ID #8921</div>
    </div>
  )
}
