'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { recordEvent, recordMount, tryInitDemoPay } from '../hooks/useSdkEventLog'
import { CLIENT_KEY, MAIN_SDK_ID, MAIN_SDK_SRC, RECEIPT_PATH, SDK_DELAY_MS, SDK_HOST_ATTR } from '../types'
import type { DemoPayInstance } from '../types'

const ORDER = { orderName: '프로 무선 기계식 키보드', amount: 189000 }

/**
 * <Script>보다 먼저 렌더되는 형제 컴포넌트. 형제 useEffect는 렌더 순서대로 실행되므로
 * 이 effect는 next/script가 <script> 태그를 붙이기 "전"에 돈다 → 첫 마운트에서 SDK 전역 객체가 없음을 실측한다.
 */
function MountProbe() {
  const recorded = useRef(false)
  useEffect(() => {
    // StrictMode의 개발 모드 이중 effect 실행에도 인스턴스당 1회만 기록한다(next/script 내부와 같은 ref 가드).
    if (recorded.current) return
    recorded.current = true
    recordMount('SDK 호스트 컴포넌트 마운트')
    const result = tryInitDemoPay(CLIENT_KEY)
    recordEvent('early-call', 'main', `마운트 직후 window.DemoPay.init() → ${result.message}`, { ok: result.ok })
  }, [])
  return null
}

export function PaymentSdkCheckout() {
  const [instance, setInstance] = useState<DemoPayInstance | null>(null)
  const [lastRequest, setLastRequest] = useState<string | null>(null)

  const handleLoad = () => {
    const sdk = window.DemoPay
    recordEvent(
      'onLoad',
      'main',
      sdk ? `DemoPay v${sdk.version} · 스크립트 실행 ${sdk.executionCount}회 · 서버 지연 ${sdk.delayMs}ms` : 'window.DemoPay 없음',
    )
  }

  const handleReady = () => {
    const result = tryInitDemoPay(CLIENT_KEY)
    recordEvent('onReady', 'main', `onReady 안에서 init() → ${result.message}`, { ok: result.ok })
    if (result.instance) setInstance(result.instance)
  }

  const handleManualCall = () => {
    const result = tryInitDemoPay(CLIENT_KEY)
    recordEvent('manual-call', 'main', `버튼으로 init() 직접 호출 → ${result.message}`, { ok: result.ok })
  }

  const handlePay = () => {
    if (!instance) return
    const res = instance.requestPayment(ORDER)
    setLastRequest(`instance #${res.instanceId} · ${res.orderName} ${res.amount.toLocaleString()}원 · t=${res.requestedAt.toFixed(1)}ms`)
  }

  return (
    <div {...{ [SDK_HOST_ATTR]: '' }} className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <MountProbe />
      <Script id={MAIN_SDK_ID} src={MAIN_SDK_SRC} onLoad={handleLoad} onReady={handleReady} />

      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-zinc-800 dark:text-zinc-200">결제 주문 정보</span>
        <span
          className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
            instance
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}
        >
          {instance ? `SDK 인스턴스 #${instance.instanceId}` : 'SDK 로드 대기'}
        </span>
      </div>

      <div className="rounded border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
          <span>{ORDER.orderName}</span>
          <span>{ORDER.amount.toLocaleString()}원</span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-500">
          SDK: <code className="break-all">{MAIN_SDK_SRC}</code> (서버가 {SDK_DELAY_MS}ms 실제 지연 후 응답)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleManualCall}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          window.DemoPay.init() 지금 직접 호출
        </button>
        <button
          type="button"
          onClick={handlePay}
          disabled={!instance}
          className="rounded-md bg-zinc-900 px-3 py-2 text-xs font-bold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {instance ? `${ORDER.amount.toLocaleString()}원 결제 요청` : 'onReady 전에는 비활성'}
        </button>
      </div>
      {lastRequest && (
        <p className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">requestPayment() 반환값: {lastRequest}</p>
      )}

      <Link
        href={RECEIPT_PATH}
        className="inline-block text-xs font-medium text-blue-600 underline dark:text-blue-400"
      >
        주문 내역 페이지로 이동 (Link 소프트 내비게이션 → 이 컴포넌트 언마운트)
      </Link>
    </div>
  )
}
