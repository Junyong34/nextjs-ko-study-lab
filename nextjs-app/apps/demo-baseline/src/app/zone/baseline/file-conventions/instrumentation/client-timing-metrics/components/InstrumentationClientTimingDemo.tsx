'use client'

import React from 'react'
import Link from 'next/link'
import { useTransitionMetrics } from '../hooks/useTransitionMetrics'
import { STATION_LABELS, STATION_PATHS, type StationId } from '../types'

export function InstrumentationClientTimingDemo({ station }: { station: StationId }) {
  const { transitions } = useTransitionMetrics()
  const other: StationId = station === 'dashboard' ? 'report' : 'dashboard'

  return (
    <div className="space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div>
          <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            현재 위치: {STATION_LABELS[station]} ({station === 'dashboard' ? '/' : '/station-b'})
          </div>
          <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            아래 버튼으로 실제 라우트를 이동하면 instrumentation-client.ts의 onRouterTransitionStart가 호출되고,
            도착한 페이지가 마운트되는 순간까지의 실제 경과 시간이 기록됩니다.
          </p>
        </div>
        <Link
          href={STATION_PATHS[other]}
          className="shrink-0 rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
        >
          {STATION_LABELS[other]}로 이동 →
        </Link>
      </div>

      <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-[11px]">
          <thead className="bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-2.5 py-1.5 font-semibold">#</th>
              <th className="px-2.5 py-1.5 font-semibold">목적지 url</th>
              <th className="px-2.5 py-1.5 font-semibold">navigationType</th>
              <th className="px-2.5 py-1.5 font-semibold">실측 전환 시간</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 font-mono dark:divide-zinc-800">
            {transitions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-2.5 py-3 text-center text-zinc-400">
                  아직 기록된 라우터 전환이 없습니다. 위 버튼으로 실제 이동을 발생시켜 보세요.
                </td>
              </tr>
            ) : (
              transitions.map((t) => (
                <tr key={t.seq} className="text-zinc-700 dark:text-zinc-300">
                  <td className="px-2.5 py-1.5">{t.seq}</td>
                  <td className="px-2.5 py-1.5">{t.url}</td>
                  <td className="px-2.5 py-1.5">{t.navigationType}</td>
                  <td className="px-2.5 py-1.5">
                    {t.durationMs === null ? (
                      <span className="text-amber-600 dark:text-amber-400">측정 중…</span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {t.durationMs.toFixed(1)} ms
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
