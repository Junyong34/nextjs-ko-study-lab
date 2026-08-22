'use client'
import React, { useState } from 'react'

export function CookiesGetSetDemo() {
  const [cookieVal, setCookieVal] = useState('session_token=abc987; HttpOnly')

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="font-mono text-zinc-700 dark:text-zinc-300">현재 쿠키: <span className="text-emerald-600 font-bold">{cookieVal}</span></div>
      <button type="button" onClick={() => setCookieVal('session_token=NEW_VIP_999; HttpOnly; Secure')} className="rounded bg-zinc-900 px-3 py-1.5 font-bold text-white dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
        Server Action: 쿠키 갱신 (.set)
      </button>
    </div>
  )
}
