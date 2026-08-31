'use client'
import React, { useState } from 'react'
import Script from 'next/script'

interface PgSdkOnloadDemoProps {
  onReady: () => void
  onOpen: (orderId: string) => void
}

declare global {
  interface Window {
    __pgSdk?: { ready: boolean; loadedAt: number; open: () => { orderId: string } }
  }
}

export function PgSdkOnloadDemo({ onReady, onOpen }: PgSdkOnloadDemoProps) {
  const [sdkReady, setSdkReady] = useState(false)
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)

  return (
    <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <Script
        src="/zone/baseline/guides/scripts/pg-sdk-onload/api/sdk"
        strategy="afterInteractive"
        onLoad={() => {
          setSdkReady(true)
          onReady()
        }}
      />
      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
        결제 SDK 상태: {sdkReady ? '[확인] PG사 결제 모듈 준비 완료 (onLoad)' : '로딩 중...'}
      </div>
      <button
        type="button"
        disabled={!sdkReady}
        onClick={() => {
          if (!window.__pgSdk) return
          const result = window.__pgSdk.open()
          setLastOrderId(result.orderId)
          onOpen(result.orderId)
        }}
        className="rounded bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-2xs disabled:opacity-40 cursor-pointer"
      >
        안전 결제창 열기
      </button>
      {lastOrderId && <div className="text-[11px] font-mono text-zinc-500">window.__pgSdk.open() 실제 반환값: orderId={lastOrderId}</div>}
    </div>
  )
}
