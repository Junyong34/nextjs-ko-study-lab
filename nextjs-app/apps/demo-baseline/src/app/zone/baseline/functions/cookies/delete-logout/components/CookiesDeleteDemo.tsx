'use client'
import React, { useState } from 'react'

export function CookiesDeleteDemo() {
  const [isLogged, setIsLogged] = useState(true)

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-bold text-zinc-900 dark:text-zinc-100">로그인 상태: {isLogged ? '[확인] VIP 회원 로그인 중' : '로그아웃됨 (세션 쿠키 삭제됨)'}</div>
      <button type="button" onClick={() => setIsLogged(false)} className="rounded bg-rose-600 px-3.5 py-1.5 font-bold text-white cursor-pointer">
        로그아웃 (cookies().delete)
      </button>
    </div>
  )
}
