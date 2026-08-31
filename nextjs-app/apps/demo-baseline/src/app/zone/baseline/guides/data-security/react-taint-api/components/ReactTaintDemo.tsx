'use client'
import React from 'react'

interface TaintTestOutcome {
  kind: 'safe' | 'leak-blocked' | 'leak-not-blocked'
  message: string
  timestamp: string
}

interface ReactTaintDemoProps {
  lastOutcome: TaintTestOutcome | null
  isPending: boolean
  onSafeCall: () => void
  onLeakAttempt: () => void
}

export function ReactTaintDemo({ lastOutcome, isPending, onSafeCall, onLeakAttempt }: ReactTaintDemoProps) {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">React Taint API 실습 콘솔</h4>
        <p className="text-xs text-zinc-500">결제 시크릿 키는 experimental_taintUniqueValue로 마킹되어 있습니다.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onSafeCall}
          disabled={isPending}
          className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer"
        >
          안전한 호출 (마스킹된 값만 반환)
        </button>
        <button
          onClick={onLeakAttempt}
          disabled={isPending}
          className="rounded bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
        >
          위험한 시도 (원본 시크릿 반환 시도)
        </button>
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1">
        <div className="font-bold text-zinc-400 border-b border-zinc-800 pb-1">실행 결과:</div>
        {lastOutcome ? (
          <div className="space-y-1 pt-1 text-[11px]">
            <div
              className={
                lastOutcome.kind === 'leak-not-blocked'
                  ? 'text-red-400 font-bold'
                  : 'text-emerald-400 font-bold'
              }
            >
              {lastOutcome.kind === 'safe' && '안전한 호출 성공 (시크릿 미노출)'}
              {lastOutcome.kind === 'leak-blocked' && 'React Taint API가 실제로 유출을 차단함'}
              {lastOutcome.kind === 'leak-not-blocked' && '경고: 시크릿이 그대로 반환됨 (Taint 미작동)'}
            </div>
            <div className="whitespace-pre-wrap text-zinc-400">{lastOutcome.message}</div>
            <div className="text-zinc-500">[{lastOutcome.timestamp}]</div>
          </div>
        ) : (
          <div className="pt-1 text-[11px] text-zinc-500">버튼을 눌러 두 시나리오를 비교하세요</div>
        )}
      </div>
    </div>
  )
}

export type { TaintTestOutcome }
