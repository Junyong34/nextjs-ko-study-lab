'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { SCENARIOS } from '../expectations'
import type { Measurement, Prediction, ScenarioId } from '../types'

interface Props {
  value: string
  onValueChange: (v: string) => void
  prediction: Prediction | null
  onPredict: (p: Prediction) => void
  results: Measurement[]
  error: string | null
  isPending: boolean
  onSend: (id: ScenarioId) => void
  onReset: () => void
}

const btn =
  'rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer'
const json = (o: unknown) => JSON.stringify(o)

export function RewritePanel(p: Props) {
  const latest = p.results[0]
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center gap-3 border-b pb-3 dark:border-zinc-800">
        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          1) 값(id / sku){' '}
          <input
            value={p.value}
            onChange={(e) => p.onValueChange(e.target.value)}
            inputMode="numeric"
            className="ml-1 w-20 rounded border border-zinc-300 bg-white px-2 py-1 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <fieldset className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
          <legend className="sr-only">예측</legend>
          <span className="font-bold">2) rewrite가 적용될까?</span>
          {(['rewritten', 'not-rewritten'] as const).map((v) => (
            <label key={v} className="flex cursor-pointer items-center gap-1">
              <input type="radio" name="rewrite-prediction" checked={p.prediction === v} onChange={() => p.onPredict(v)} />
              {v === 'rewritten' ? '적용된다' : '적용되지 않는다'}
            </label>
          ))}
        </fieldset>
        <DemoResetButton onReset={p.onReset} />
      </div>

      <div className="space-y-1.5">
        <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">3) 요청 보내기</div>
        <ul className="space-y-1.5">
          {SCENARIOS.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-2">
              <button onClick={() => p.onSend(s.id)} disabled={p.isPending || p.value === ''} className={btn}>
                {s.label}
              </button>
              <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] dark:bg-zinc-800">…{s.buildPath(p.value || '값')}</code>
              <span className="text-[11px] text-zinc-500">{s.note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-1.5 rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800">
        {p.error && <div className="text-rose-400">요청 실패: {p.error}</div>}
        {latest ? (
          <>
            <div>요청 URL: <span className="font-bold text-sky-400">{latest.requestedPath}</span></div>
            <div>응답 URL: <span className="font-bold text-sky-400">{latest.responsePath}</span> · 상태 <span className="font-bold text-emerald-400">{latest.status}</span> ({latest.responseType})</div>
            <div>렌더된 목적지: <span className="font-bold text-amber-400">{latest.probe?.destination ?? '없음 (404 페이지)'}</span></div>
            <div>목적지 params: {latest.probe ? json(latest.probe.params) : '-'}</div>
            <div>목적지 searchParams: {latest.probe ? json(latest.probe.searchParams) : '-'}</div>
            <div className="border-t border-zinc-800 pt-1 text-zinc-500">
              {p.results.map((r, i) => (
                <div key={`${r.measuredAt}-${i}`}>{r.measuredAt} {r.requestedPath} → {r.status} {r.probe?.destination ?? '-'}</div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-zinc-500">{p.isPending ? '요청 중...' : '[요청 보내기] 버튼을 누르기 전입니다.'}</div>
        )}
      </div>
    </div>
  )
}
