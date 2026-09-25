'use client'

import React from 'react'
import { DEMO_LAYOUTS, ROUTES, displayRel, expectedLayouts, layoutFilesOf, shortFile } from '../routes'
import { useObservation } from './ObservationContext'

/** 경로(행) × layout 파일(열). 칸은 실제 DOM 조상 체인에 그 layout이 있었는지다. */
export function ScopeMatrix() {
  const { observations } = useObservation()
  const columns = ['app/layout.tsx', ...DEMO_LAYOUTS.map((l) => shortFile(l.file))]

  return (
    <div className="min-w-0 overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[520px] text-left text-[11px]">
        <caption className="px-3 pt-2 text-left text-xs font-bold text-zinc-900 dark:text-zinc-100">
          경로별로 실제 감싼 layout (DOM 관측)
        </caption>
        <thead>
          <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <th className="px-3 py-1.5 font-semibold">경로</th>
            {columns.map((c) => (
              <th key={c} className="px-2 py-1.5 font-mono font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROUTES.map((r) => {
            const obs = observations[r.rel]
            const actual = obs ? layoutFilesOf(obs.chain) : []
            const expected = expectedLayouts(r.rel)
            const hasRoot = obs ? obs.chain[0]?.kind === 'html' && obs.chain[1]?.kind === 'body' : false
            const cells = [hasRoot, ...DEMO_LAYOUTS.map((l) => actual.includes(l.file))]
            const expectedCells = [true, ...DEMO_LAYOUTS.map((l) => expected.includes(l.file))]
            return (
              <tr key={r.rel} className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
                <td className="px-3 py-1.5 font-mono">
                  {displayRel(r.rel)}
                  {obs && <span className="ml-1 text-[10px] text-zinc-500">({obs.via === 'link' ? 'Link 이동' : '첫 진입'})</span>}
                </td>
                {cells.map((on, i) => (
                  <td
                    key={columns[i]}
                    className={`px-2 py-1.5 font-mono ${
                      !obs ? 'text-zinc-400' : on !== expectedCells[i] ? 'font-bold text-rose-600' : on ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-400'
                    }`}
                  >
                    {!obs ? '미방문' : on ? '감쌈' : '—'}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
