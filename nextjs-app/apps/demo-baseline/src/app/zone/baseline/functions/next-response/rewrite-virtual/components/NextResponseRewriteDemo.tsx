'use client'
import React, { useEffect, useState } from 'react'

interface RewriteResponse {
  source: string
  virtualRoute: string
  targetRoute: string
  message: string
  catalogItem?: {
    id: string
    name: string
    price: number
  }
}

interface NextResponseRewriteDemoProps {
  onStatusChange?: (status: {
    isRewritten: boolean
    targetRoute?: string
    httpStatus: number | null
  }) => void
}

export function NextResponseRewriteDemo({ onStatusChange }: NextResponseRewriteDemoProps) {
  const [data, setData] = useState<RewriteResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [httpStatus, setHttpStatus] = useState<number | null>(null)

  const VIRTUAL_ENDPOINT = '/zone/baseline/functions/next-response/rewrite-virtual/api'

  const executeRewriteFetch = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(VIRTUAL_ENDPOINT)
      const json = await res.json()
      setHttpStatus(res.status)
      setData(json)
      onStatusChange?.({
        isRewritten: json.source?.includes('Target Endpoint'),
        targetRoute: json.targetRoute,
        httpStatus: res.status,
      })
    } catch {
      // ignore
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    executeRewriteFetch()
  }, [])

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">NextResponse.rewrite() 가상 경로 라우팅</h4>
            <span className="rounded bg-teal-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              URL 보존 내부 포워딩
            </span>
          </div>
          <p className="text-xs text-zinc-500">클라이언트 요청 URL을 변경하지 않고 서버 내부에서 다른 엔드포인트로 투명하게 리라이트합니다.</p>
        </div>
        <button
          onClick={executeRewriteFetch}
          disabled={isLoading}
          className="rounded bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
        >
          {isLoading ? '요청 중...' : '가상 엔드포인트 호출'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2.5">
          <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 pb-1 dark:border-zinc-800">
            라우팅 흐름 추적 (Routing Pipeline)
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">1. Client</span>
              <span className="font-mono text-zinc-600 dark:text-zinc-400">GET {VIRTUAL_ENDPOINT}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-purple-800 dark:bg-purple-950 dark:text-purple-300">2. Rewrite</span>
              <span className="text-zinc-600 dark:text-zinc-400">NextResponse.rewrite(targetUrl)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">3. Target</span>
              <span className="font-mono text-zinc-600 dark:text-zinc-400">/target/route.ts 실행 및 데이터 반환</span>
            </div>
          </div>
        </div>

        <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
          <div className="flex justify-between border-b border-zinc-800 pb-1">
            <span className="font-bold text-zinc-400 font-sans text-xs">최종 수신된 응답 본문:</span>
            {httpStatus && (
              <span className="text-emerald-400 font-bold">HTTP {httpStatus} OK</span>
            )}
          </div>
          <pre className="text-[11px] text-zinc-300 overflow-x-auto max-h-32 bg-zinc-900 p-2 rounded">
            {data ? JSON.stringify(data, null, 2) : '// 요청 대기 중...'}
          </pre>
        </div>
      </div>
    </div>
  )
}
