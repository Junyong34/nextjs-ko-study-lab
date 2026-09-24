'use client'

import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { RUN_MODE } from '../probe'
import { SAMPLES_PER_TARGET } from '../terms'
import type { TargetResult } from '../types'
import { useProbe } from './ProbeContext'

const cell = 'px-2 py-1 align-top'
const dash = (v: string | number | null) => (v === null ? '—' : String(v))

function ResultRows({ result }: { result: TargetResult }) {
  return (
    <>
      {result.samples.map((s, i) => (
        <tr key={i} className="border-t border-zinc-200 dark:border-zinc-800">
          {i === 0 && (
            <td rowSpan={result.samples.length} className={`${cell} font-bold text-zinc-900 dark:text-zinc-100`}>
              {result.target.label}
              <ul className="mt-1 space-y-0.5 font-normal">
                {result.checks.map((c) => (
                  <li key={c.label} className={c.ok ? 'text-emerald-600' : 'text-rose-600'}>
                    {c.ok ? '[O]' : '[X]'} {c.label}
                  </li>
                ))}
              </ul>
            </td>
          )}
          <td className={cell}>#{i + 1}</td>
          <td className={cell}>{s.status}</td>
          <td className={`${cell} font-bold text-blue-700 dark:text-blue-300`}>{dash(s.renderId)}</td>
          <td className={cell}>{dash(s.renderedAt)}</td>
          <td className={cell}>{dash(s.xNextjsCache)}</td>
          <td className={`${cell} break-all`}>{dash(s.cacheControl)}</td>
        </tr>
      ))}
    </>
  )
}

/** 약관 URL 6개를 각각 N번 실제 GET 요청해, 상태 코드·렌더 ID·응답 헤더를 표로 비교한다. */
export function RequestProbe() {
  const { results, running, error, run, clear } = useProbe()

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={run}
            disabled={running}
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {running ? '요청 중…' : `약관 URL을 ${SAMPLES_PER_TARGET}번씩 실제 요청`}
          </button>
          <span className="rounded border border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            실행 모드: {RUN_MODE === 'production' ? 'production (next start)' : 'development (next dev)'}
          </span>
        </div>
        <DemoResetButton label="실측 결과 초기화" onReset={clear} />
      </div>
      {error && <p className="text-xs text-rose-600">요청 실패: {error}</p>}
      {results.length > 0 && (
        <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[820px] font-mono text-[10px] text-zinc-700 dark:text-zinc-300">
            <thead className="bg-zinc-50 text-left text-zinc-500 dark:bg-zinc-900">
              <tr>
                {['URL · 판정', '요청', 'status', '렌더 ID', '서버 렌더 시각', 'x-nextjs-cache', 'cache-control'].map((h) => (
                  <th key={h} className={`${cell} font-semibold`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <ResultRows key={r.target.key} result={r} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
