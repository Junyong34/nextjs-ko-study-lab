'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { VerificationFooter } from './VerificationFooter'

// next/dynamic을 통한 클라이언트 컴포넌트 지연 로딩
const HeavyChart = dynamic(() => import('./HeavyChartClient'), {
  ssr: false,
  loading: () => (
    <div className="rounded-md border border-dashed border-zinc-300 p-8 text-center text-xs font-mono text-zinc-400 animate-pulse dark:border-zinc-700">
      [대기] 무거운 매출 차트 번들(JS Chunk) 다운로드 및 로딩 중...
    </div>
  ),
})

export function LazyChartContainer() {
  const [showChart, setShowChart] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const handleToggleChart = () => {
    setShowChart((prev) => !prev)
    setHasInteracted(true)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* 1. 지연 로딩 트리거 툴바 */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="text-zinc-600 dark:text-zinc-400">
            차트를 화면에 띄우기 전까지는 관련 번들이 메인 청크에서 분리되어 로드되지 않습니다.
          </div>

          <button
            type="button"
            onClick={handleToggleChart}
            className={`rounded px-4 py-1.5 text-xs font-semibold shadow-2xs transition cursor-pointer ${
              showChart
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900'
            }`}
          >
            {showChart ? '차트 닫기 (메모리 해제)' : '[분석] 매출 분석 차트 동적 로드 (next/dynamic)'}
          </button>
        </div>

        {/* 2. 동적 로드 차트 뷰 */}
        {showChart ? (
          <HeavyChart />
        ) : (
          <div className="rounded-md border border-zinc-200 bg-white p-8 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950">
            위 버튼을 누르면 <code className="font-mono font-bold text-zinc-700 dark:text-zinc-300">next/dynamic()</code>에 의해 별도 JS 청크가 요청되고 차트가 렌더링됩니다.
          </div>
        )}
      </div>

      {/* 3단 & 4단 검증 패널 및 개념 정리 */}
      <VerificationFooter
        showChart={showChart}
        hasInteracted={hasInteracted}
      />
    </div>
  )
}
