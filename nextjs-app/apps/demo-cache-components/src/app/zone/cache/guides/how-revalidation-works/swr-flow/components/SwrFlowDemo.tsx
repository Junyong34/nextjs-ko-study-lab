'use client'
import React, { useState } from 'react'

export function SwrFlowDemo() {
  const [step, setStep] = useState(1)
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button type="button" onClick={() => setStep(1)} className={`rounded px-2.5 py-1 text-xs font-bold ${step === 1 ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>1단계: Stale 응답 (0ms)</button>
        <button type="button" onClick={() => setStep(2)} className={`rounded px-2.5 py-1 text-xs font-bold ${step === 2 ? 'bg-amber-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>2단계: 백그라운드 재검증</button>
        <button type="button" onClick={() => setStep(3)} className={`rounded px-2.5 py-1 text-xs font-bold ${step === 3 ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>3단계: 최신 캐시 전파</button>
      </div>
      <div className="rounded border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950 font-mono text-xs space-y-1">
        {step === 1 && <div className="text-blue-600 dark:text-blue-400">[확인] [Client 1] 만료된 캐시(Stale)를 0ms 만에 즉시 수신하여 화면을 렌더링함</div>}
        {step === 2 && <div className="text-amber-600 dark:text-amber-400">[즉시] [Server Background] 비동기 데이터 패칭 및 새 캐시 스냅샷 생성 중...</div>}
        {step === 3 && <div className="text-emerald-600 dark:text-emerald-400">[확인] [Client 2+] 새로 생성된 Fresh 캐시를 즉시 서빙함 (수명 주기 리셋)</div>}
      </div>
    </div>
  )
}
