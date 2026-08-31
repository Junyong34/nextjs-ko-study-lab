'use client'

import React, { useEffect, useState, useTransition } from 'react'
import type { AuthCookieState, RouteGuardTestResult } from '../types'
import { toggleAuthCookieAction } from '../actions'

interface MiddlewareGuardDemoProps {
  initialState: AuthCookieState
  onResult?: (state: { authState: AuthCookieState; lastResult: RouteGuardTestResult | null }) => void
}

const ROUTE_META: Record<string, { label: string; protected: boolean }> = {
  admin: { label: '/admin (관리자 전용)', protected: true },
  mypage: { label: '/mypage/orders (주문내역)', protected: true },
  public: { label: '/catalog (상품목록)', protected: false },
}

// proxy.ts(실제 Next.js 엣지 미들웨어)를 향해 실제 HTTP 요청을 보내
// 이 요청이 307로 리다이렉트되는지(response.redirected)를 관찰한다. 시뮬레이션이 아니다.
async function probeMiddlewareGuard(probe: string): Promise<RouteGuardTestResult> {
  const meta = ROUTE_META[probe]
  const res = await fetch(`${window.location.pathname}?probe=${probe}`, {
    cache: 'no-store',
  })

  if (res.redirected) {
    return {
      path: meta.label,
      status: 307,
      decision: 'REDIRECTED',
      redirectUrl: res.url,
      reason: `proxy.ts가 auth_token 쿠키를 찾지 못해 307 Temporary Redirect로 실제 응답함 (response.redirected === true)`,
      timestamp: new Date().toLocaleTimeString(),
    }
  }

  return {
    path: meta.label,
    status: (res.status === 307 ? 307 : 200) as 200 | 307,
    decision: 'ALLOWED',
    reason: meta.protected
      ? `proxy.ts가 유효한 auth_token 쿠키를 확인해 리다이렉트 없이 통과시킴`
      : `공개 라우트: proxy.ts가 인증 여부와 무관하게 통과시킴`,
    timestamp: new Date().toLocaleTimeString(),
  }
}

export function MiddlewareGuardDemo({ initialState, onResult }: MiddlewareGuardDemoProps) {
  const [authState, setAuthState] = useState<AuthCookieState>(initialState)
  const [selectedPath, setSelectedPath] = useState<string>('admin')
  const [lastResult, setLastResult] = useState<RouteGuardTestResult | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    onResult?.({ authState, lastResult })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState, lastResult])

  const handleToggleCookie = () => {
    startTransition(async () => {
      const next = await toggleAuthCookieAction()
      setAuthState(next)
      // 즉시 선택된 경로에 대한 실제 미들웨어 재검사 실행
      const result = await probeMiddlewareGuard(selectedPath)
      setLastResult(result)
    })
  }

  const handleTestPath = (path: string) => {
    setSelectedPath(path)
    startTransition(async () => {
      const result = await probeMiddlewareGuard(path)
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
            { key: 'admin', label: '/admin (관리자 전용)', tag: '보호 라우트' },
            { key: 'mypage', label: '/mypage/orders (주문내역)', tag: '보호 라우트' },
            { key: 'public', label: '/catalog (상품목록)', tag: '공개 라우트' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => handleTestPath(item.key)}
              disabled={isPending}
              className={`flex flex-col items-start rounded-md border p-2.5 text-left text-xs transition cursor-pointer ${
                selectedPath === item.key
                  ? 'border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-950/30'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950'
              }`}
            >
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{item.label}</span>
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
