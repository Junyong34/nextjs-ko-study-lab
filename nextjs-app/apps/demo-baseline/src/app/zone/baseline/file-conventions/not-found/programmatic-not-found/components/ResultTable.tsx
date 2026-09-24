'use client'
import React from 'react'
import { SCENARIOS } from '../scenarios'
import type { ScenarioResult } from '../hooks/useTriggerRunner'

interface Props {
  results: Record<string, ScenarioResult>
  runningKey: string | null
}

const cell = 'px-2 py-1.5 align-top'

function fmt(expected: string, actual: string | null, ok: boolean | null) {
  return (
    <span className="block font-mono">
      <span className="text-zinc-500">{expected}</span>
      {actual !== null && (
        <span className={ok ? 'block whitespace-pre-line text-emerald-700 dark:text-emerald-400' : 'block whitespace-pre-line text-rose-600 dark:text-rose-400'}>
          {actual}
        </span>
      )}
    </span>
  )
}

export function ResultTable({ results, runningKey }: Props) {
  return (
    <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[640px] text-left text-[11px]">
        <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900/60 dark:text-zinc-400">
          <tr>
            <th className={cell}>호출 위치 / 조건</th>
            <th className={cell}>HTTP 상태</th>
            <th className={cell}>렌더된 경계</th>
            <th className={cell}>notFound() 직전 / 다음 줄</th>
            <th className={cell}>끝까지 렌더</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {SCENARIOS.map((s) => {
            const r = results[s.key]
            const expectReached = s.expectSite ? 1 : 0
            const expectRendered = s.expectRendered ? 1 : 0
            return (
              <tr key={s.key} className={runningKey === s.key ? 'bg-amber-50/60 dark:bg-amber-950/20' : ''}>
                <td className={cell}>
                  <span className="block font-semibold text-zinc-900 dark:text-zinc-100">{s.where}</span>
                  <span className="block text-zinc-500">{s.condition}</span>
                  {r?.error && <span className="block text-rose-600">{r.error}</span>}
                </td>
                <td className={cell}>
                  {s.mode === 'soft'
                    ? fmt(
                        '문서 재요청 없음',
                        r ? `새로고침 없음: ${r.noReload ? '예' : '아니오'}\nRSC 요청 ${r.status ?? '측정 불가'} (관찰값)` : null,
                        r ? r.noReload === true : null,
                      )
                    : fmt(
                        `기대 ${s.mode === 'action' ? 'POST ' : ''}${s.expectStatus}`,
                        r ? `실제 ${s.mode === 'action' ? 'POST ' : ''}${r.status ?? '측정 실패'}` : null,
                        r ? r.status === s.expectStatus : null,
                      )}
                </td>
                <td className={cell}>
                  {fmt(
                    `기대 ${s.expectBoundary ?? '없음(정상 화면)'}`,
                    r ? `실제 ${r.boundary ?? `없음(${r.renderedRoute ?? '-'})`}` : null,
                    r ? r.boundary === s.expectBoundary : null,
                  )}
                </td>
                <td className={cell}>
                  {fmt(
                    `기대 +${expectReached} / +0`,
                    r ? `실제 +${r.reachedDelta} / +${r.afterDelta}` : null,
                    r ? r.reachedDelta === expectReached && r.afterDelta === 0 : null,
                  )}
                </td>
                <td className={cell}>
                  {fmt(`기대 +${expectRendered}`, r ? `실제 +${r.renderedDelta}` : null, r ? r.renderedDelta === expectRendered : null)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
