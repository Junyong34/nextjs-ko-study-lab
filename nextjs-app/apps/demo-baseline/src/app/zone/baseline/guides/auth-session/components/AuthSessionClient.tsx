'use client'

import React, { useState, useTransition } from 'react'
import { loginAction, logoutAction } from '../actions'
import type { UserSession } from '../types'

interface AuthSessionClientProps {
  initialSession: UserSession
}

export function AuthSessionClient({ initialSession }: AuthSessionClientProps) {
  const [session, setSession] = useState<UserSession>(initialSession)
  const [isPending, startTransition] = useTransition()

  const handleLogin = (role: 'customer' | 'admin') => {
    startTransition(async () => {
      const res = await loginAction(role === 'admin' ? 'admin_01' : 'user_hong', role)
      setSession(res)
    })
  }

  const handleLogout = () => {
    startTransition(async () => {
      const res = await logoutAction()
      setSession(res)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 세션 상태 카드 */}
      <div className="rounded-md border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              현재 로그인 세션 상태:
            </span>
            <span
              className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                session.isLoggedIn
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {session.isLoggedIn ? 'AUTHENTICATED' : 'ANONYMOUS'}
            </span>
          </div>

          {session.isLoggedIn && (
            <span className="font-mono text-xs text-zinc-500">
              권한: <strong className="text-zinc-800 dark:text-zinc-200">{session.role}</strong>
            </span>
          )}
        </div>

        {session.isLoggedIn ? (
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded bg-zinc-50 p-3 dark:bg-zinc-900">
              <div>
                <div className="font-bold text-zinc-900 dark:text-zinc-100">
                  {session.userName} ({session.userId})
                </div>
                <div className="font-mono text-[10px] text-zinc-400 mt-0.5">
                  세션 토큰: {session.token}
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                className="rounded bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
              >
                {isPending ? '처리 중...' : '로그아웃'}
              </button>
            </div>

            {/* 권한별 뷰 분기 */}
            <div className="rounded border border-blue-200 bg-blue-50/40 p-3 dark:border-blue-900/50 dark:bg-blue-950/20 text-xs">
              <span className="font-bold text-blue-950 dark:text-blue-200">
                {session.role === 'admin'
                  ? '️ 관리자 전용 대시보드 권한 활성화됨 (전체 정산 및 주문 승인 가능)'
                  : '️ 일반 고객 마이페이지 권한 활성화됨 (내 주문 내역 조회 가능)'}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500">
              현재 로그인되어 있지 않습니다. 아래 버튼을 눌러 모의 로그인을 진행하세요.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleLogin('customer')}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
              >
                <span>사용자 로그인 (CUSTOMER)</span>
              </button>

              <button
                type="button"
                onClick={() => handleLogin('admin')}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 rounded bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
              >
                <span>관리자 로그인 (ADMIN)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
