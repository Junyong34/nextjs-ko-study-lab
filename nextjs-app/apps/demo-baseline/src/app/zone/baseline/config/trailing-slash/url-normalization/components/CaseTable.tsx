'use client'
import React from 'react'
import { CASES } from '../lib/cases'
import { isProbeResult, judgeCase } from '../lib/judge'
import type { Prediction, ProbeOutcome } from '../types'

const shortPath = (p: string) => p.replace('/zone/baseline/config/trailing-slash/url-normalization', '…')

interface Props {
  outcomes: Record<string, ProbeOutcome>
  predictions: Record<string, Prediction>
  pendingId: string | null
  onPredict: (id: string, p: Prediction) => void
  onRun: (id: string) => void
}

export function CaseTable({ outcomes, predictions, pendingId, onPredict, onRun }: Props) {
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-xs">
        <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
          <tr>
            <th className="py-2 pr-2 font-medium">요청 경로</th>
            <th className="py-2 pr-2 font-medium">예측</th>
            <th className="py-2 pr-2 font-medium">실측 (상태 · Location)</th>
            <th className="py-2 pr-2 font-medium">true였다면 (설명)</th>
            <th className="py-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          {CASES.map((c) => {
            const o = outcomes[c.id]
            const ok = isProbeResult(o) ? judgeCase(c, o) : null
            return (
              <tr key={c.id} className="border-b border-zinc-100 align-top dark:border-zinc-900">
                <td className="py-2 pr-2">
                  <div className="font-medium">{c.label}</div>
                  <code className="break-all text-[11px] text-zinc-500">{shortPath(c.path)}</code>
                </td>
                <td className="py-2 pr-2">
                  <select
                    aria-label={`${c.label} 예측`}
                    value={predictions[c.id] ?? ''}
                    onChange={(e) => onPredict(c.id, e.target.value ? (Number(e.target.value) as 200 | 308) : null)}
                    className="rounded border border-zinc-300 bg-white px-1.5 py-1 dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <option value="">예측 안 함</option>
                    <option value="200">200 그대로</option>
                    <option value="308">308 리다이렉트</option>
                  </select>
                </td>
                <td className="py-2 pr-2 font-mono text-[11px]">
                  {!o && <span className="text-zinc-400">대기</span>}
                  {o && !isProbeResult(o) && <span className="text-rose-600">{o.error}</span>}
                  {isProbeResult(o) && (
                    <span className={ok ? 'text-emerald-600' : 'font-bold text-rose-600'}>
                      {o.status} · {o.location ? shortPath(o.location) : 'Location 없음'}
                      <span className="block text-zinc-500">{ok ? '문서 기준과 일치' : '문서 기준과 다름'} · {o.elapsedMs}ms</span>
                    </span>
                  )}
                </td>
                <td className="py-2 pr-2 text-zinc-500">{c.ifTrue}</td>
                <td className="py-2 text-right">
                  <button
                    type="button"
                    onClick={() => onRun(c.id)}
                    disabled={pendingId !== null}
                    className="rounded border border-zinc-300 px-2 py-1 disabled:opacity-50 dark:border-zinc-700"
                  >
                    {pendingId === c.id ? '요청 중' : '요청'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
