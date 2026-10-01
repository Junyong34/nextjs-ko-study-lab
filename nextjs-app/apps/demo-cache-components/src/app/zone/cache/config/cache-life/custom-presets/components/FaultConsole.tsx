'use client'
import React from 'react'
import type { PresetProbeState } from '../hooks/usePresetProbe'
import { isFaultMatched } from '../lib/judge'
import { FAULTS } from '../types'

export function FaultConsole({ state }: { state: PresetProbeState }) {
  const { faults, runFault } = state
  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">잘못된 cacheLife 값 실행해 보기</p>
      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
        next.config.ts에 잘못된 프리셋을 적으면 dev 서버가 아예 뜨지 않으므로, 같은 검증 함수를 거치는 인라인
        호출과 미선언 이름으로 실제 오류를 받아 옵니다.
      </p>
      {FAULTS.map((f) => {
        const result = faults[f.key]
        const matched = isFaultMatched(f.key, result)
        return (
          <div key={f.key} className="space-y-1.5 rounded border border-zinc-100 p-2.5 dark:border-zinc-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <code className="break-all font-mono text-[11px] text-zinc-700 dark:text-zinc-300">{f.code}</code>
              <button
                type="button"
                onClick={() => void runFault(f.key)}
                className="cursor-pointer rounded border border-zinc-300 bg-white px-2.5 py-1 text-[11px] font-bold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
              >
                {f.label} 실행
              </button>
            </div>
            {result ? (
              <pre
                className={`whitespace-pre-wrap break-all rounded p-2 font-mono text-[10px] ${matched ? 'bg-zinc-950 text-rose-300' : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'}`}
              >
                HTTP {result.httpStatus}
                {'\n'}
                {result.error}
              </pre>
            ) : (
              <p className="text-[10px] text-zinc-400">아직 실행하지 않았습니다.</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
