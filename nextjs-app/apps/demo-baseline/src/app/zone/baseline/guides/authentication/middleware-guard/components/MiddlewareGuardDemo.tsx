'use client'
import React, { useState } from 'react'
export function MiddlewareGuardDemo() {
  const [hasAuth, setHasAuth] = useState(false)
  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-900 dark:text-zinc-100">인증 쿠키: {hasAuth ? 'auth_token=valid' : '(없음)'}</span>
        <button type="button" onClick={() => setHasAuth(a => !a)} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">쿠키 토글</button>
      </div>
      <div className="rounded bg-zinc-50 p-3 text-xs dark:bg-zinc-900 font-mono">
        /admin 접근 시 결과: {hasAuth ? '[확인] 200 OK (관리자 대시보드 통과)' : '[주의]️ 307 Redirect -> /login'}
      </div>
    </div>
  )
}
