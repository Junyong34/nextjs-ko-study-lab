'use client'

import React, { useState } from 'react'

const PROBE_URL = '/zone/cache/functions/update-tag/instant-memory-sync/error-probe'

interface ProbeResult {
  status: number
  threw: boolean
  code: string | null
  message: string
}

/** 같은 updateTag를 Server Action이 아닌 Route Handler(POST)에서 호출했을 때의 실제 결과 */
export function RouteHandlerProbe() {
  const [result, setResult] = useState<ProbeResult | null>(null)
  const [loading, setLoading] = useState(false)

  const probe = async () => {
    setLoading(true)
    try {
      const res = await fetch(PROBE_URL, { method: 'POST' })
      const body = await res.json()
      setResult({ status: res.status, threw: body.threw, code: body.code, message: body.message })
    } catch (e) {
      setResult({ status: 0, threw: false, code: null, message: `요청 실패: ${e instanceof Error ? e.message : String(e)}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2 rounded-md border border-dashed border-zinc-300 p-3 text-xs dark:border-zinc-700">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-zinc-700 dark:text-zinc-300">
          Route Handler <code className="font-mono">POST …/error-probe</code>에서 <code className="font-mono">updateTag()</code> 호출
        </span>
        <button
          type="button"
          onClick={probe}
          disabled={loading}
          className="cursor-pointer rounded bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {loading ? '호출 중...' : 'Route Handler에서 호출해 보기'}
        </button>
      </div>
      {result && (
        <div className={`rounded p-2 font-mono text-[11px] ${result.threw ? 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300' : 'bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'}`}>
          <div>
            HTTP {result.status} · {result.threw ? `에러 발생${result.code ? ` (${result.code})` : ''}` : '에러 없음'}
          </div>
          <div className="mt-1 break-words">{result.message}</div>
        </div>
      )}
    </div>
  )
}
