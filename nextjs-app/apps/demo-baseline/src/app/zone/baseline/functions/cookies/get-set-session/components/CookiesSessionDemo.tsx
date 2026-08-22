'use client'
import React, { useState } from 'react'
import { MOCK_USER_SESSIONS } from '@study/demo-kit'

export function CookiesSessionDemo() {
  const [currentRole, setCurrentRole] = useState<'customer' | 'vip' | 'admin'>('customer')
  const [cartSessionId, setCartSessionId] = useState('guest_cart_' + Math.floor(1000 + Math.random() * 9000))
  const [issuedCookies, setIssuedCookies] = useState<Record<string, string>>({
    'session-token': 'jwt_token_sample_abc123',
    'cart-session': cartSessionId,
    'user-role': 'CUSTOMER'
  })

  const handleSwitchUser = (role: 'customer' | 'vip' | 'admin') => {
    setCurrentRole(role)
    const session = MOCK_USER_SESSIONS[role]
    setIssuedCookies({
      'session-token': 'jwt_' + session.userId + '_' + Date.now(),
      'cart-session': 'cart_' + session.userId,
      'user-role': session.role,
      'user-tier': session.tier
    })
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-950 text-xs">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2.5 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">cookies().get() & set() 세션 및 장바구니 쿠키 관리</h4>
          <p className="text-zinc-500 text-[11px]">서버 컴포넌트/Server Actions에서 HttpOnly 세션 쿠키를 안전하게 발급 및 검증합니다.</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(['customer', 'vip', 'admin'] as const).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => handleSwitchUser(r)}
            className={`flex-1 rounded p-2 text-left cursor-pointer transition ${
              currentRole === r
                ? 'border-blue-600 bg-blue-50/50 border font-bold dark:border-blue-500 dark:bg-blue-950/20'
                : 'border border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900'
            }`}
          >
            <div className="text-zinc-900 dark:text-zinc-100">{MOCK_USER_SESSIONS[r].name} ({MOCK_USER_SESSIONS[r].role})</div>
            <div className="text-zinc-500 text-[11px] font-mono mt-0.5">등급: {MOCK_USER_SESSIONS[r].tier} | 적립금: {MOCK_USER_SESSIONS[r].points.toLocaleString()}P</div>
          </button>
        ))}
      </div>

      <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 font-mono space-y-1.5">
        <span className="font-bold text-zinc-700 dark:text-zinc-300">현재 요청의 Server Cookies 헤더:</span>
        {Object.entries(issuedCookies).map(([k, v]) => (
          <div key={k} className="flex justify-between text-[11px] text-zinc-600 dark:text-zinc-400">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{k}</span>
            <span className="text-zinc-900 dark:text-zinc-200">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
