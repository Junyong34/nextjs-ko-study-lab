'use client'

import React from 'react'
import type { ScenarioKind, ScenarioResults } from '../types'

export const SCENARIOS: { kind: ScenarioKind; label: string; hint: string }[] = [
  { kind: 'direct', label: '클라이언트 직접 호출', hint: '브라우저 → legacy/orders · inventory · shipping (3회, 병렬)' },
  { kind: 'bff-serial', label: 'BFF 1회 (내부 직렬)', hint: '브라우저 → bff?mode=serial → 서버에서 await 3번 차례로' },
  { kind: 'bff-parallel', label: 'BFF 1회 (내부 Promise.all)', hint: '브라우저 → bff?mode=parallel → 서버에서 동시에' },
]

const ms = (v: number) => `${Math.round(v)} ms`
const bytes = (v: number) => `${v.toLocaleString()} B`

interface ScenarioTableProps {
  results: ScenarioResults
  running: ScenarioKind | null
  onRun: (kind: ScenarioKind) => void
}

export function ScenarioTable({ results, running, onRun }: ScenarioTableProps) {
  return (
    <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[640px] text-left text-xs">
        <thead className="bg-zinc-50 text-[11px] text-zinc-500 dark:bg-zinc-900/60">
          <tr>
            <th className="px-3 py-2 font-semibold">시나리오</th>
            <th className="px-3 py-2 font-semibold">브라우저 요청 수</th>
            <th className="px-3 py-2 font-semibold">클라이언트 총 소요</th>
            <th className="px-3 py-2 font-semibold">BFF 서버 내부</th>
            <th className="px-3 py-2 font-semibold">응답 본문 합계</th>
            <th className="px-3 py-2 font-semibold">전송량(헤더 포함)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {SCENARIOS.map(({ kind, label, hint }) => {
            const r = results[kind]
            return (
              <tr key={kind} className="align-top">
                <td className="px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => onRun(kind)}
                    disabled={running !== null}
                    className="cursor-pointer rounded bg-zinc-900 px-2.5 py-1 text-xs font-bold text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    {running === kind ? '호출 중...' : label}
                  </button>
                  <div className="mt-1 text-[10px] text-zinc-500 break-keep">{hint}</div>
                </td>
                <td className="px-3 py-2.5 font-mono">
                  {r ? (
                    <>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{r.requestCount}건</span>
                      <ul className="mt-1 space-y-0.5 text-[10px] text-zinc-500 break-all">
                        {r.requestedPaths.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-3 py-2.5 font-mono">{r ? ms(r.clientMs) : '-'}</td>
                <td className="px-3 py-2.5 font-mono">{r?.server ? ms(r.server.serverMs) : r ? '해당 없음' : '-'}</td>
                <td className="px-3 py-2.5 font-mono">
                  {r ? bytes(r.bodyBytes) : '-'}
                  {r?.dataBytes != null && (
                    <div className="mt-1 text-[10px] text-zinc-500">화면 데이터 {bytes(r.dataBytes)} + 측정 meta</div>
                  )}
                </td>
                <td className="px-3 py-2.5 font-mono">{r ? (r.transferBytes > 0 ? bytes(r.transferBytes) : '브라우저 미제공') : '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
