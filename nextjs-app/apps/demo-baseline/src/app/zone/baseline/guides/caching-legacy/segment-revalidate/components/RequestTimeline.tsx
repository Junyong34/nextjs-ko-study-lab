'use client'

import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { AUTO_INTERVAL_MS, AUTO_REQUESTS } from '../routes'
import { RUN_MODE, ageSeconds, cacheStatus } from '../probe'
import type { ProbeSample } from '../types'
import { useProbe } from './ProbeContext'

const cell = 'px-2 py-1 align-top'
const dash = (v: string | null) => v ?? '—'
const btn =
  'rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-50 border border-zinc-300 bg-white text-zinc-800 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200'
const primary =
  'rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900'

const statusTone: Record<string, string> = {
  HIT: 'text-emerald-700 dark:text-emerald-400',
  STALE: 'text-amber-700 dark:text-amber-400',
  MISS: 'text-rose-700 dark:text-rose-400',
}

function previousOfSameRoute(samples: ProbeSample[], i: number) {
  for (let j = i - 1; j >= 0; j--) if (samples[j].route === samples[i].route) return samples[j]
  return undefined
}

function Row({ s, prev }: { s: ProbeSample; prev: ProbeSample | undefined }) {
  const status = cacheStatus(s)
  const changed = prev !== undefined && prev.renderId !== s.renderId
  const age = ageSeconds(s)
  return (
    <tr className="border-t border-zinc-200 dark:border-zinc-800">
      <td className={cell}>#{s.seq}</td>
      <td className={cell}>+{(s.elapsedMs / 1000).toFixed(1)}s</td>
      <td className={`${cell} font-bold`}>{s.route}/</td>
      <td className={`${cell} font-bold ${status ? (statusTone[status] ?? '') : ''}`}>{dash(status)}</td>
      <td className={`${cell} font-bold text-blue-700 dark:text-blue-300`}>
        {dash(s.renderId)}
        {changed && <span className="ml-1 font-normal text-rose-600">(교체)</span>}
      </td>
      <td className={cell}>{age === null ? '—' : `${age.toFixed(1)}s`}</td>
      <td className={cell}>{dash(s.renderedAt?.slice(11, 23) ?? null)}</td>
      <td className={`${cell} break-all`}>{dash(s.cacheControl)}</td>
    </tr>
  )
}

/** 하위 page를 실제로 GET 요청한 기록을 시간순으로 보여준다. 같은 route의 직전 응답과 렌더 ID가 다르면 (교체)로 표시. */
export function RequestTimeline() {
  const { samples, running, error, requestOnce, runAuto, clear } = useProbe()
  const busy = running !== null
  const totalSec = ((AUTO_REQUESTS - 1) * AUTO_INTERVAL_MS) / 1000

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={runAuto} disabled={busy} className={primary}>
            {running === 'auto' ? '자동 관측 중…' : `자동 관측 (약 ${totalSec}초, ${AUTO_INTERVAL_MS / 1000}초 간격)`}
          </button>
          <button type="button" onClick={() => requestOnce('isr-10s')} disabled={busy} className={btn}>
            isr-10s/ 1회 요청
          </button>
          <button type="button" onClick={() => requestOnce('static')} disabled={busy} className={btn}>
            static/ 1회 요청
          </button>
          <span className="rounded border border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            실행 모드: {RUN_MODE === 'production' ? 'production (next start)' : 'development (next dev)'}
          </span>
        </div>
        <DemoResetButton label="기록 초기화" onReset={clear} />
      </div>
      <p className="text-[10px] text-zinc-500">
        캐시 상태는 응답 헤더 <code>x-nextjs-cache</code>(next start) 값이며, Vercel 배포에서는 <code>x-vercel-cache</code>로 대신 표시합니다.
        렌더 후 경과 = 응답 수신 시각(브라우저 시계) - HTML에 박힌 서버 렌더 시각.
      </p>
      {error && <p className="text-xs text-rose-600">요청 실패: {error}</p>}
      {samples.length > 0 && (
        <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[760px] font-mono text-[10px] text-zinc-700 dark:text-zinc-300">
            <thead className="bg-zinc-50 text-left text-zinc-500 dark:bg-zinc-900">
              <tr>
                {['요청', '경과', 'page', '캐시 상태', '렌더 ID', '렌더 후 경과', '서버 렌더 시각(UTC)', 'cache-control'].map(
                  (h) => (
                    <th key={h} className={`${cell} font-semibold`}>
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {samples.map((s, i) => (
                <Row key={s.seq} s={s} prev={previousOfSameRoute(samples, i)} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
