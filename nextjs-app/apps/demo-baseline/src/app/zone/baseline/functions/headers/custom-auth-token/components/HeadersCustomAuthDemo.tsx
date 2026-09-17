'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { DebugHeader, OrderLookupResult } from '../types'
import { loginAction, logoutAction, tamperTokenAction } from '../actions'

interface HeadersCustomAuthDemoProps {
  result: OrderLookupResult
  debugHeaders: DebugHeader[]
}

export function HeadersCustomAuthDemo({ result, debugHeaders }: HeadersCustomAuthDemoProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handle = (action: () => Promise<void>) => {
    startTransition(async () => {
      await action()
      // 로컬 state를 조작하지 않고, 서버 컴포넌트를 다시 요청해 headers()가 새 요청의
      // Authorization 헤더를 실제로 다시 읽게 한다.
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 세션 제어 영역 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="text-xs">
          <span className="font-semibold text-zinc-600 dark:text-zinc-400">주문 조회 세션 제어:</span>
          <span className="ml-2 font-mono text-zinc-800 dark:text-zinc-200">
            현재 상태 ={' '}
            <strong className={result.status === 200 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
              {result.status === 200 ? '인증됨' : '미인증'}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handle(loginAction)}
            disabled={isPending}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => handle(tamperTokenAction)}
            disabled={isPending}
            className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900 transition hover:bg-amber-100 disabled:opacity-40 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300 cursor-pointer"
          >
            토큰 변조
          </button>
          <button
            type="button"
            onClick={() => handle(logoutAction)}
            disabled={isPending}
            className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 cursor-pointer"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 2. 서버 수신 헤더 및 주문 조회 결과 */}
      <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
          <div className="flex items-center gap-2 font-sans">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">주문 조회 함수 응답:</span>
            <span
              className={`rounded px-2 py-0.5 text-[11px] font-bold ${
                result.status === 200
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
              }`}
            >
              {result.status === 200 ? 'HTTP 200 OK' : 'HTTP 401 Unauthorized'}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="font-sans font-semibold text-zinc-500 dark:text-zinc-400">
            headers().get(&apos;authorization&apos;) 원본 값:
          </span>
          <div className="rounded bg-zinc-50 p-2.5 text-[11px] break-all dark:bg-zinc-900">
            {result.authorizationReceived ?? '(헤더 없음 — 로그인하지 않았거나 로그아웃한 상태)'}
          </div>
        </div>

        {result.status === 200 ? (
          <div className="space-y-1.5 rounded-md bg-emerald-50/60 p-3 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-300">
            <div className="font-sans font-bold">주문 내역 {result.orders?.length}건 조회 성공</div>
            {result.orders?.map((order) => (
              <div key={order.id} className="font-sans">
                • {order.id} — {order.item} ({order.amount.toLocaleString()}원)
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md bg-red-50/60 p-3 font-sans text-red-900 dark:bg-red-950/30 dark:text-red-300">
            <div className="font-bold">주문 조회 거부</div>
            <div className="mt-1">{result.error}</div>
          </div>
        )}

        {debugHeaders.length > 0 && (
          <div className="space-y-1 pt-1">
            <div className="font-sans font-semibold text-zinc-500 dark:text-zinc-400">
              참고: 같은 요청에서 함께 읽은 다른 헤더
            </div>
            <div className="rounded bg-zinc-50 p-2.5 text-[11px] dark:bg-zinc-900">
              {debugHeaders.map((h) => (
                <div key={h.key} className="truncate">
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">• {h.key}:</span>{' '}
                  <span className="text-zinc-500">{h.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
