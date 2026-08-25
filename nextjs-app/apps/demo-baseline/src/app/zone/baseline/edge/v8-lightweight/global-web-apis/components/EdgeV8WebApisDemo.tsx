'use client'

import React, { useState } from 'react'

export function EdgeV8WebApisDemo() {
  const [inputPayload, setInputPayload] = useState('orderId=8921&amount=129000&timestamp=2026-08-25')
  const [hashResult, setHashResult] = useState<{
    hex: string
    latencyMs: number
    byteLength: number
    calculatedAt: string
  } | null>(null)

  const handleComputeHash = async () => {
    const start = performance.now()
    const encoder = new TextEncoder()
    const data = encoder.encode(inputPayload)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    const latency = performance.now() - start

    setHashResult({
      hex,
      latencyMs: Math.max(0.1, Number(latency.toFixed(2))),
      byteLength: hashBuffer.byteLength,
      calculatedAt: new Date().toLocaleTimeString(),
    })
  }

  return (
    <div className="space-y-4">
      {/* 1. 입력 및 Web Crypto 연산 트리거 */}
      <div className="space-y-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-zinc-700 dark:text-zinc-300 font-sans">
            Web Crypto (crypto.subtle) 결제 무결성 서명 계산:
          </span>
          <span className="rounded bg-blue-100 px-2 py-0.5 font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            V8 Web Standard
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputPayload}
            onChange={(e) => setInputPayload(e.target.value)}
            placeholder="해시할 페이로드 데이터 입력..."
            className="flex-1 rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 shadow-2xs focus:border-blue-500 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
          <button
            type="button"
            onClick={handleComputeHash}
            className="rounded bg-blue-600 px-4 py-1.5 font-sans text-xs font-bold text-white transition hover:bg-blue-500 cursor-pointer shadow-2xs"
          >
            SHA-256 서명 생성 실행
          </button>
        </div>
      </div>

      {/* 2. 연산 결과 뷰어 */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950 space-y-2.5">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800 font-sans">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            SHA-256 다이제스트 출력
          </span>
          <span className="text-[11px] text-zinc-400">
            {hashResult ? `연산 지연: ${hashResult.latencyMs}ms` : '대기 중'}
          </span>
        </div>

        {hashResult ? (
          <div className="space-y-2">
            <div className="rounded bg-zinc-50 p-3 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 break-all">
              <div className="text-zinc-500 text-[11px] mb-1 font-sans">계산된 서명 해시 (256-bit):</div>
              <div className="font-bold text-emerald-600 dark:text-emerald-400">{hashResult.hex}</div>
            </div>
            <div className="flex justify-between text-[11px] text-zinc-500 pt-1 font-sans">
              <span>바이트 길이: {hashResult.byteLength} bytes</span>
              <span>계산 시각: {hashResult.calculatedAt}</span>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center text-zinc-400 font-sans">
            상단의 [SHA-256 서명 생성 실행] 버튼을 클릭하여 V8 Web Crypto 표준 다이제스트를 생성하세요.
          </div>
        )}
      </div>
    </div>
  )
}
