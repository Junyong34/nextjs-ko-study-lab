'use client'
import React, { useState } from 'react'
import { TRIGGER_404_BASE_PATH } from '../types'

interface ApiResult {
  sku: string
  status: number
  body: string
}

const BUTTON_STYLE = 'rounded px-2.5 py-1 text-xs font-semibold cursor-pointer disabled:opacity-50'

export function InventoryApiDemo() {
  const [result, setResult] = useState<ApiResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkSku = async (sku: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${TRIGGER_404_BASE_PATH}/api/inventory/${sku}`, { cache: 'no-store' })
      const body = await res.text()
      setResult({ sku, status: res.status, body })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">재고 조회 API (api/inventory/[sku]/route.ts)</h4>
        <p className="text-xs text-zinc-500">
          Route Handler에서 notFound()를 호출합니다. 존재하지 않는 SKU를 조회하면 HTML이 아니라 순수 HTTP 404
          응답으로 끝납니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => checkSku('SKU-100')} disabled={isLoading} className={`${BUTTON_STYLE} bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900`}>
          SKU-100 조회 (존재)
        </button>
        <button onClick={() => checkSku('SKU-101')} disabled={isLoading} className={`${BUTTON_STYLE} bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900`}>
          SKU-101 조회 (존재)
        </button>
        <button onClick={() => checkSku('SKU-999')} disabled={isLoading} className={`${BUTTON_STYLE} bg-amber-600 text-white hover:bg-amber-700`}>
          SKU-999 조회 (존재하지 않음)
        </button>
      </div>

      <div className="space-y-1 rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800">
        {result ? (
          <>
            <div className={result.status === 404 ? 'font-bold text-rose-400' : 'font-bold text-emerald-400'}>
              GET /api/inventory/{result.sku} → 실제 응답 {result.status}
              {result.status === 404 ? ' Not Found' : ' OK'}
            </div>
            <div className="whitespace-pre-wrap text-zinc-400">{result.body}</div>
          </>
        ) : (
          <div className="text-zinc-500">위 버튼을 눌러 실제 fetch 요청을 보내보세요.</div>
        )}
      </div>

      <p className="text-[11px] text-zinc-400">
        터미널에서도 동일하게 확인 가능: <code>curl -i {TRIGGER_404_BASE_PATH}/api/inventory/SKU-999</code>
      </p>
    </div>
  )
}
