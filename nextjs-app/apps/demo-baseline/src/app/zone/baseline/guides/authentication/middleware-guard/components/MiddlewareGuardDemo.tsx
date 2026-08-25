'use client'

import React, { useState, useTransition } from 'react'
import type { AuthCookieState, RouteGuardTestResult } from '../types'
import { toggleAuthCookieAction, testMiddlewareRouteAccess } from '../actions'

interface MiddlewareGuardDemoProps {
  initialState: AuthCookieState
}

export function MiddlewareGuardDemo({ initialState }: MiddlewareGuardDemoProps) {
  const [authState, setAuthState] = useState<AuthCookieState>(initialState)
  const [selectedPath, setSelectedPath] = useState<string>('/admin')
  const [lastResult, setLastResult] = useState<RouteGuardTestResult | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggleCookie = () => {
    startTransition(async () => {
      const next = await toggleAuthCookieAction()
      setAuthState(next)
      // 즉시 선택된 경로에 대한 재검사 실행
      const result = await testMiddlewareRouteAccess(selectedPath)
      setLastResult(result)
    })
  }

  const handleTestPath = (path: string) => {
    setSelectedPath(path)
    startTransition(async () => {
      const result = await testMiddlewareRouteAccess(path)
      setLastResult(result)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 쿠키 상태 제어 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-zinc-600 dark:text-zinc-400">현재 인증 쿠키:</span>
          <code className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${
            authState.hasAuth
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
          }`}>
            {authState.hasAuth ? 'auth_token=valid' : '(없음)'}
          </code>
          {authState.user && (
            <span className="text-zinc-500 dark:text-zinc-400">
              ({authState.user.name} • {authState.user.role})
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleToggleCookie}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
        >
          {isPending ? '쿠키 변경 중...' : '쿠키 토글'}
        </button>
      </div>

      {/* 2. 라우트 요청 테스트 패널 */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          테스트할 대상 라우트 선택:
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { path: '/admin', label: '/admin (관리자 전용)', tag: '보호 라우트' },
            { path: '/mypage/orders', label: '/mypage/orders (주문내역)', tag: '보호 라우트' },
            { path: '/catalog', label: '/catalog (상품목록)', tag: '공개 라우트' },
          ].map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => handleTestPath(item.path)}
              disabled={isPending}
              className={`flex flex-col items-start rounded-md border p-2.5 text-left text-xs transition cursor-pointer ${
                selectedPath === item.path
                  ? 'border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-950/30'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950'
              }`}
            >
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{item.path}</span>
              <span className="mt-0.5 text-[11px] text-zinc-500">{item.tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. 미들웨어 판정 결과 뷰어 */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-2 flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
          <span className="font-sans font-bold text-zinc-700 dark:text-zinc-300">
            Next.js Middleware 가드 실행 결과
          </span>
          <span className="text-[11px] text-zinc-400">
            {lastResult?.timestamp || '실시간 대기 중'}
          </span>
        </div>

        {lastResult ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">요청 경로:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{lastResult.path}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-500">HTTP 판정:</span>
              <span
                className={`inline-flex items-center rounded px-2 py-0.5 font-bold ${
                  lastResult.status === 200
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {lastResult.status === 200 ? '200 OK (인가 성공)' : '307 Temporary Redirect'}
              </span>
            </div>
            {lastResult.redirectUrl && (
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <span>리다이렉트 타깃:</span>
                <code>{lastResult.redirectUrl}</code>
              </div>
            )}
            <div className="text-zinc-600 dark:text-zinc-400">
              <span>사유: </span>
              {lastResult.reason}
            </div>
          </div>
        ) : (
          <div className="text-zinc-500 dark:text-zinc-400">
            상단의 [쿠키 토글] 버튼을 클릭하거나 경로를 선택하여 미들웨어 가드 실행을 확인하세요.
          </div>
        )}
      </div>
    </div>
  )
}
