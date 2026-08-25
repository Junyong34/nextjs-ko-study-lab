'use client'

import React, { useState, useTransition } from 'react'
import type { AuthHeaderCheckResult } from '../types'
import { validateAuthTokenAction } from '../actions'

interface HeadersCustomAuthDemoProps {
  initialResult: AuthHeaderCheckResult
}

export function HeadersCustomAuthDemo({ initialResult }: HeadersCustomAuthDemoProps) {
  const [result, setResult] = useState<AuthHeaderCheckResult>(initialResult)
  const [customInput, setCustomInput] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4OTIxIiwicm9sZSI6InZpcCJ9')
  const [isPending, startTransition] = useTransition()

  const handleTestToken = (tokenValue?: string) => {
    const val = tokenValue !== undefined ? tokenValue : customInput
    startTransition(async () => {
      const res = await validateAuthTokenAction(val)
      setResult(res)
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 프리셋 및 커스텀 토큰 입력 영역 */}
      <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            Authorization Bearer 토큰 프리셋:
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                const valid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4OTIxIiwicm9sZSI6InZpcCJ9'
                setCustomInput(valid)
                handleTestToken(valid)
              }}
              disabled={isPending}
              className="rounded bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 cursor-pointer"
            >
              유효 Bearer 토큰
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomInput('expired_token')
                handleTestToken('expired_token')
              }}
              disabled={isPending}
              className="rounded border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900 transition hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-300 cursor-pointer"
            >
              만료된 토큰
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomInput('forged_token')
                handleTestToken('forged_token')
              }}
              disabled={isPending}
              className="rounded border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-900 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300 cursor-pointer"
            >
              위조 토큰
            </button>
            <button
              type="button"
              onClick={() => {
                setCustomInput('')
                handleTestToken('')
              }}
              disabled={isPending}
              className="rounded border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
            >
              헤더 누락
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="직접 Bearer 토큰 문자열 입력..."
            className="flex-1 rounded border border-zinc-300 bg-white px-3 py-1.5 font-mono text-xs text-zinc-900 shadow-2xs focus:border-zinc-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
          <button
            type="button"
            onClick={() => handleTestToken()}
            disabled={isPending}
            className="rounded bg-blue-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-blue-500 disabled:opacity-50 cursor-pointer"
          >
            {isPending ? '검증 중...' : '토큰 검증'}
          </button>
        </div>
      </div>

      {/* 2. 서버 수신 헤더 및 인증 판정 카드 */}
      <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
          <div className="flex items-center gap-2 font-sans">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              서버 headers() 파싱 결과:
            </span>
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
          <span className="text-[11px] text-zinc-400">{result.timestamp}</span>
        </div>

        {result.status === 200 ? (
          <div className="space-y-2 rounded-md bg-emerald-50/60 p-3 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-300">
            <div className="font-bold">[확인] 서버 인증 완료: User ID #{result.userId}</div>
            <div>• 역할 권한: {result.role}</div>
            <div>• 허용 스코프: {result.scope?.join(', ')}</div>
            <div>• 수신 토큰: authorization: Bearer {result.tokenReceived} (유효 토큰)</div>
          </div>
        ) : (
          <div className="rounded-md bg-red-50/60 p-3 text-red-900 dark:bg-red-950/30 dark:text-red-300">
            <div className="font-bold">[오류] 인증 거부</div>
            <div className="mt-1">{result.error}</div>
          </div>
        )}

        {/* 수신된 Raw HTTP Headers 리스트 */}
        <div className="space-y-1 pt-1">
          <div className="font-sans font-semibold text-zinc-500 dark:text-zinc-400">
            수신된 HTTP Headers:
          </div>
          <div className="max-h-32 overflow-y-auto rounded bg-zinc-50 p-2.5 text-[11px] dark:bg-zinc-900">
            {result.headersList.map((h, i) => (
              <div key={i} className="truncate">
                <span className="font-bold text-zinc-700 dark:text-zinc-300">• {h.key}:</span>{' '}
                <span className="text-zinc-500">{h.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
