'use client'

import React, { useState, useTransition } from 'react'
import { DemoResetButton } from '@study/demo-kit'

export interface HeaderCheckResult {
  poweredBy: string | null
  status: number
  checkedUrl: string
  timestamp: string
}

interface ConfigPoweredByDemoProps {
  onResult: (result: HeaderCheckResult) => void
}

export function ConfigPoweredByDemo({ onResult }: ConfigPoweredByDemoProps) {
  const [isPending, startTransition] = useTransition()
  const [lastResult, setLastResult] = useState<HeaderCheckResult | null>(null)

  const handleCheck = () => {
    startTransition(async () => {
      const url = window.location.pathname
      const res = await fetch(url, { cache: 'no-store' })
      const result: HeaderCheckResult = {
        poweredBy: res.headers.get('x-powered-by'),
        status: res.status,
        checkedUrl: url,
        timestamp: new Date().toLocaleTimeString(),
      }
      setLastResult(result)
      onResult(result)
    })
  }

  const handleReset = () => {
    setLastResult(null)
  }

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-zinc-600 dark:text-zinc-400">
        아래 버튼을 누르면 이 페이지 자신의 URL을 <code>fetch()</code>로 다시 요청해, 실제 HTTP 응답에{' '}
        <code>x-powered-by</code> 헤더가 있는지 직접 확인합니다.
      </p>
      <button
        type="button"
        onClick={handleCheck}
        disabled={isPending}
        className="cursor-pointer rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
      >
        {isPending ? '요청 중...' : '응답 헤더 실제로 확인하기'}
      </button>

      {lastResult && (
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-900">
          <div>요청 경로: {lastResult.checkedUrl}</div>
          <div>응답 status: {lastResult.status}</div>
          <div>
            x-powered-by:{' '}
            <span className={lastResult.poweredBy ? 'font-bold text-rose-600' : 'font-bold text-emerald-600 dark:text-emerald-400'}>
              {lastResult.poweredBy ?? '(없음 — 헤더 자체가 응답에 없음)'}
            </span>
          </div>
          <div className="text-zinc-400">{lastResult.timestamp}</div>
        </div>
      )}

      <div className="flex justify-end pt-1">
        <DemoResetButton onReset={handleReset} label="예제 초기화" />
      </div>
    </div>
  )
}
