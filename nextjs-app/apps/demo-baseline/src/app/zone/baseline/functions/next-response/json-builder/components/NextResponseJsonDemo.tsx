'use client'
import React, { useEffect, useState } from 'react'
import { INVALID_PROBE_STATUS, STATUS_OPTIONS } from '../types'
import type { JsonBuilderResponseState } from '../types'

interface NextResponseJsonDemoProps {
  onStatusChange?: (status: JsonBuilderResponseState) => void
}

const API_ENDPOINT = '/zone/baseline/functions/next-response/json-builder/api'

export function NextResponseJsonDemo({ onStatusChange }: NextResponseJsonDemoProps) {
  const [selectedStatus, setSelectedStatus] = useState<number>(200)
  const [responseStatus, setResponseStatus] = useState<number | null>(null)
  const [builderHeader, setBuilderHeader] = useState<string | null>(null)
  const [authHeader, setAuthHeader] = useState<string | null>(null)
  const [responseBody, setResponseBody] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const requestJsonBuilder = async (statusCode: number) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_ENDPOINT}?status=${statusCode}`)
      const builderHeaderVal = res.headers.get('x-study-response-builder')
      const authHeaderVal = res.headers.get('x-custom-header-auth')
      const json = await res.json()

      setResponseStatus(res.status)
      setBuilderHeader(builderHeaderVal)
      setAuthHeader(authHeaderVal)
      setResponseBody(json)

      onStatusChange?.({
        requestedStatus: statusCode,
        httpStatus: res.status,
        builderHeader: builderHeaderVal,
        authHeader: authHeaderVal,
        isSuccess: res.ok,
      })
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    requestJsonBuilder(200)
  }, [])

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">NextResponse.json() 빌더 및 헤더 제어</h4>
            <span className="rounded bg-violet-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-300">
              NextResponse.json(body, init)
            </span>
          </div>
          <p className="text-xs text-zinc-500">NextResponse.json() 유틸리티를 사용하여 상태 코드와 커스텀 응답 헤더를 조립합니다.</p>
        </div>
        {responseStatus && (
          <span className={`rounded px-2.5 py-1 text-xs font-mono font-bold ${
            responseStatus >= 200 && responseStatus < 300
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
          }`}>
            HTTP {responseStatus}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
          <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            HTTP 응답 상태 코드 선택
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {STATUS_OPTIONS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => {
                  setSelectedStatus(code)
                  requestJsonBuilder(code)
                }}
                disabled={isLoading}
                className={`rounded px-3 py-2 text-xs font-semibold cursor-pointer text-left transition-colors ${
                  selectedStatus === code
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="text-[11px] text-zinc-500 pt-1">
            버튼을 클릭하면 <code>api/route.ts</code>로 해당 상태 코드를 요청하여 서버에서 동적으로 조립된 <code>NextResponse.json()</code> 응답을 반환받습니다.
          </div>

          <div className="mt-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <button
              onClick={() => {
                setSelectedStatus(INVALID_PROBE_STATUS)
                requestJsonBuilder(INVALID_PROBE_STATUS)
              }}
              disabled={isLoading}
              className={`w-full rounded px-3 py-2 text-xs font-semibold cursor-pointer text-left transition-colors ${
                selectedStatus === INVALID_PROBE_STATUS
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
              }`}
            >
              {INVALID_PROBE_STATUS} 요청 (허용되지 않는 값 — 서버 검증 확인)
            </button>
            <div className="text-[11px] text-zinc-500 pt-1">
              화이트리스트에 없는 상태 코드를 요청해도 서버가 그대로 반영하지 않고 기본값으로 대체하는지 확인합니다.
            </div>
          </div>
        </div>

        <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
          <div className="border-b border-zinc-800 pb-1 space-y-0.5">
            <div className="font-bold text-zinc-400 font-sans text-xs">서버 응답 헤더 & 본문:</div>
            <div className="text-[10px] text-violet-400">builder: {builderHeader || '없음'}</div>
            <div className="text-[10px] text-violet-400">auth: {authHeader || '없음'}</div>
          </div>
          <pre className="text-[11px] text-zinc-300 overflow-x-auto max-h-36 bg-zinc-900 p-2 rounded">
            {responseBody ? JSON.stringify(responseBody, null, 2) : '// 응답 수신 중...'}
          </pre>
        </div>
      </div>
    </div>
  )
}
