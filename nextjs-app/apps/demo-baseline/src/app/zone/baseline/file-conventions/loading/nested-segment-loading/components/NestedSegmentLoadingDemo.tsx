'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { DemoResetButton } from '@study/demo-kit'
import { useLoadingObservation } from './LoadingObservation'
import { createRunId, NESTED_LOADING_BASE_PATH } from '../types'

function formatTime(at: number | null) {
  if (!at) return '대기 중'
  const d = new Date(at)
  return `${d.toLocaleTimeString('ko-KR', { hour12: false })}.${String(at % 1000).padStart(3, '0')}`
}

function StatusRow({ label, at }: { label: string; at: number | null }) {
  return (
    <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className={at ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}>
        {formatTime(at)}
      </span>
    </div>
  )
}

/**
 * 라우트와 무관하게 항상 마운트된 채로(=root layout.tsx의 자식) 보이는 실습 콘솔.
 * [새 실행 시작]이 매번 새 catalog/[run] 경로를 만들어 Router Cache 재사용을 피한다.
 */
export function NestedSegmentLoadingDemo() {
  const router = useRouter()
  const { activeRunId, timeline, startRun, reset } = useLoadingObservation()

  const handleStart = () => {
    const runId = createRunId()
    startRun(runId)
    router.push(`${NESTED_LOADING_BASE_PATH}/catalog/${runId}`)
  }

  const handleReset = () => {
    reset()
    if (typeof window !== 'undefined') {
      // 내부 진입점(홈)으로 실제 full navigation — 클라이언트 상태·Router Cache를 모두 비운다.
      window.location.href = NESTED_LOADING_BASE_PATH
    }
  }

  return (
    <div className="min-w-0 space-y-3 rounded border border-zinc-200 bg-white p-4 text-xs shadow-2xs dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="font-bold text-zinc-900 dark:text-zinc-100">중첩 세그먼트 로딩 관측 콘솔</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleStart}
            className="rounded bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 active:scale-95"
          >
            새 실행 시작 (신규 [run] 경로 생성)
          </button>
          <DemoResetButton onReset={handleReset} label="예제 초기화" />
        </div>
      </div>

      <div className="min-w-0 rounded bg-zinc-50 p-2.5 dark:bg-zinc-900/60">
        <div className="mb-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          현재 실행:{' '}
          <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{activeRunId ?? '없음'}</span>
        </div>
        <div className="space-y-1">
          <StatusRow label="① 카탈로그 상위 fallback 관측" at={timeline?.catalogFallbackSeenAt ?? null} />
          <StatusRow label="② 카탈로그 완료" at={timeline?.catalogReadyAt ?? null} />
          <StatusRow label="③ 상품 하위 fallback 관측" at={timeline?.productFallbackSeenAt ?? null} />
          <StatusRow label="④ fallback 중 상위 조작" at={timeline?.parentActionAt ?? null} />
          <StatusRow label="⑤ 상품 상세 완료" at={timeline?.productReadyAt ?? null} />
        </div>
      </div>
    </div>
  )
}
