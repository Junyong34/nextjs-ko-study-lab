'use client'

import React from 'react'
import { LEGACY_LABEL } from '../constants'
import type { ScenarioResults } from '../types'

/** BFF가 서버에서 기록한 레거시 호출 구간(meta.spans)을 막대로 그린다. 직렬은 계단, 병렬은 겹친 막대가 된다. */
export function ServerTimeline({ results }: { results: ScenarioResults }) {
  const runs = (['bff-serial', 'bff-parallel'] as const)
    .map((kind) => results[kind])
    .filter((r): r is NonNullable<typeof r> => Boolean(r?.server))

  if (runs.length === 0) {
    return (
      <p className="rounded border border-dashed border-zinc-300 px-3 py-2 text-[11px] text-zinc-500 dark:border-zinc-700">
        BFF 시나리오를 실행하면 서버가 기록한 레거시 호출 구간(시작~끝 ms)이 여기에 그려집니다.
      </p>
    )
  }

  const scale = Math.max(...runs.map((r) => r.server!.serverMs), 1)

  return (
    <div className="space-y-3">
      {runs.map((r) => (
        <div key={r.kind} className="space-y-1">
          <div className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
            {r.server!.mode === 'parallel' ? 'Promise.all (병렬)' : 'await 차례로 (직렬)'} — 서버 측정{' '}
            <span className="font-mono">{Math.round(r.server!.serverMs)} ms</span>
          </div>
          {r.server!.spans.map((s) => (
            <div key={s.service} className="flex items-center gap-2 text-[10px]">
              <span className="w-24 shrink-0 text-zinc-500">{LEGACY_LABEL[s.service]}</span>
              <div className="relative h-3 flex-1 rounded bg-zinc-100 dark:bg-zinc-900">
                <div
                  className="absolute h-3 rounded bg-zinc-700 dark:bg-zinc-300"
                  style={{
                    left: `${(s.startMs / scale) * 100}%`,
                    width: `${Math.max(((s.endMs - s.startMs) / scale) * 100, 0.5)}%`,
                  }}
                />
              </div>
              <span className="w-24 shrink-0 text-right font-mono text-zinc-500">
                {Math.round(s.startMs)}→{Math.round(s.endMs)}ms
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
