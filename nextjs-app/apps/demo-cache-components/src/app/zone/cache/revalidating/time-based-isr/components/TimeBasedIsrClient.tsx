'use client'

import React, { useState, useEffect } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { VerificationFooter } from './VerificationFooter'

interface TimeBasedIsrClientProps {
  generatedTimestamp: string
  cacheId: string
}

export function TimeBasedIsrClient({
  generatedTimestamp,
  cacheId,
}: TimeBasedIsrClientProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const isStale = elapsed >= 10

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <DemoPlaygroundCard title="시간 기반 캐시 수명 주기(SWR) 모니터" className="space-y-4">
        {/* 1. 캐시 상태 및 실시간 경과 타이머 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-1">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              캐시 생성 시각
            </div>
            <div className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {generatedTimestamp}
            </div>
          </div>

          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-1">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              캐시 고유 ID
            </div>
            <div className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
              #{cacheId}
            </div>
          </div>

          <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-1">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              클라이언트 경과 시간 (Stale 감지)
            </div>
            <div className="flex items-center justify-between font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">
              <span>{elapsed}초 경과</span>
              <span
                className={`rounded px-1.5 py-0.2 text-[10px] ${
                  isStale
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {isStale ? 'Stale 상태 (10초 경과)' : 'Fresh 상태'}
              </span>
            </div>
          </div>
        </div>

        {/* 2. 브라우저 새로고침 제어 버튼 */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-zinc-200 bg-white p-3.5 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            {isStale
              ? '10초가 지났으므로 [새로고침]을 누르면 백그라운드에서 새 캐시가 생성(SWR)됩니다.'
              : '10초 이내에는 [새로고침]을 눌러도 기존 캐시 ID가 그대로 유지됩니다.'}
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 rounded bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white shadow-2xs transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
          >
            <span>브라우저 새로고침 (SWR 테스트)</span>
          </button>
        </div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter
        elapsed={elapsed}
        isStale={isStale}
        generatedTimestamp={generatedTimestamp}
        cacheId={cacheId}
      />
    </div>
  )
}
