'use client'

import React from 'react'
import { PROBE_META } from '../types'
import type { ProbeStore } from '../types'

type Row =
  | { kind: 'mark'; label: string; at: number }
  | { kind: 'run'; at: number; run: ProbeStore['runs'][number] }

/** 스토어에 쌓인 실측 기록(스크립트 실행 + 하이드레이션 + load 이벤트)을 실제 시각 순으로 나열한다. */
export function ExecutionTimeline({ store }: { store: ProbeStore | null }) {
  if (!store) return <p className="text-zinc-400">측정 대기 중...</p>

  const rows: Row[] = [
    ...(store.hydratedAt !== null ? [{ kind: 'mark' as const, label: '하이드레이션 커밋 (레이아웃 첫 useEffect)', at: store.hydratedAt }] : []),
    ...(store.loadAt !== null ? [{ kind: 'mark' as const, label: 'window load 이벤트 종료 (loadEventEnd)', at: store.loadAt }] : []),
    ...store.runs.map((run) => ({ kind: 'run' as const, at: run.at, run })),
  ].sort((a, b) => a.at - b.at)

  return (
    <ol className="space-y-0.5 font-mono text-[11px]">
      {rows.map((row, i) =>
        row.kind === 'mark' ? (
          <li key={`mark-${row.label}`} className="text-purple-700 dark:text-purple-400">
            {i + 1}. t={row.at.toFixed(1)}ms ── {row.label}
          </li>
        ) : (
          <li key={`${row.run.name}-${row.run.execNo}`} className="text-zinc-800 dark:text-zinc-200">
            {i + 1}. t={row.at.toFixed(1)}ms [{row.run.name} #{row.run.execNo}]{' '}
            <span className="text-zinc-500">
              {PROBE_META[row.run.name].strategy} · {PROBE_META[row.run.name].placement} · readyState={row.run.readyState}
            </span>
            {row.run.name.startsWith('core-plugin') && (
              <span className={row.run.coreReady ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                {' '}· 코어 전역 {row.run.coreReady ? '있음' : '없음'}
              </span>
            )}
          </li>
        ),
      )}
    </ol>
  )
}
