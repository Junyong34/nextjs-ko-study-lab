'use client'

import React, { useState } from 'react'
import Script from 'next/script'

export function ScriptPgSdkOnloadDemo() {
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'IDLE' | 'PROCESSING' | 'COMPLETED'>('IDLE')
  const [logs, setLogs] = useState<string[]>([
    '<Script strategy="lazyOnload" /> 태그 마운트됨 (백그라운드 비동기 로드)',
  ])

  const handleSdkReady = () => {
    setSdkLoaded(true)
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] onLoad 이벤트 트리거: TossPayments PG SDK 인스턴스 초기화 완료 (window.TossPayments 준비됨)`,
      ...prev,
    ])
  }

  const handlePay = () => {
    if (!sdkLoaded) return
    setPaymentStep('PROCESSING')
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] tossPayments.requestPayment('카드', { amount: 189000, orderName: '프로 무선 기계식 키보드' }) 호출`,
      ...prev,
    ])
    setTimeout(() => {
      setPaymentStep('COMPLETED')
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] 결제 승인 완료: 결제키 pay_toss_20260822_success (200 OK)`,
        ...prev,
      ])
    }, 800)
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* 1. Header */}
      <div className="border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
          next/script onLoad 이벤트 콜백 및 PG 결제 SDK 연동
        </h4>
        <p className="text-xs text-zinc-500">
          외부 결제 모듈(TossPayments, KakaoPay)을 안전하게 지연 로드하고 onLoad 콜백을 통해 결제 기능을 활성화합니다.
        </p>
      </div>

      {/* next/script 태그 마운트 */}
      <Script
        src="https://js.tosspayments.com/v1/payment-widget"
        strategy="lazyOnload"
        onLoad={handleSdkReady}
        onError={() => {
          // Fallback offline mock for testing environments
          handleSdkReady()
        }}
      />

      {/* 2. 결제창 위젯 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-700 dark:text-zinc-300">결제 주문 정보</span>
            <span
              className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                sdkLoaded
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}
            >
              {sdkLoaded ? 'PG SDK Ready' : 'SDK Loading...'}
            </span>
          </div>

          <div className="rounded bg-white p-3 shadow-2xs dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 space-y-1">
            <div className="flex justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <span>프로 무선 기계식 키보드</span>
              <span>189,000원</span>
            </div>
            <div className="text-[11px] text-zinc-500">배송비 무료 / 1회차 즉시 결제</div>
          </div>

          <button
            type="button"
            onClick={handlePay}
            disabled={!sdkLoaded || paymentStep === 'PROCESSING'}
            className={`w-full rounded py-2 text-xs font-bold shadow-2xs transition cursor-pointer ${
              !sdkLoaded
                ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed dark:bg-zinc-800'
                : paymentStep === 'COMPLETED'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {!sdkLoaded
              ? 'SDK 로드 대기 중...'
              : paymentStep === 'PROCESSING'
                ? '결제 처리 중...'
                : paymentStep === 'COMPLETED'
                  ? '✓ 결제 완료됨 (189,000원)'
                  : '189,000원 카드 결제하기'}
          </button>
        </div>

        {/* 3. 실시간 SDK 이벤트 로그 */}
        <div className="rounded border border-zinc-200 bg-zinc-950 p-4 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-2">
          <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1 flex justify-between">
            <span>onLoad 이벤트 수명주기 로그:</span>
            <button
              type="button"
              onClick={handleSdkReady}
              className="text-[10px] text-blue-400 hover:underline"
            >
              [onLoad 강제 시뮬레이션]
            </button>
          </div>
          <div className="space-y-1 text-[11px]">
            {logs.map((log, i) => (
              <div
                key={i}
                className={
                  i === 0
                    ? 'text-emerald-400 font-semibold'
                    : 'text-zinc-500'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
