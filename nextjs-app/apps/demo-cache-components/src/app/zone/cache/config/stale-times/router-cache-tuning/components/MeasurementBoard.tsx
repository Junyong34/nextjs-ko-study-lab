'use client'

import React, { useEffect, useState } from 'react'
import { useStaleTimesLab } from './StaleTimesProvider'
import { ROUTE_LABEL, ROUTES, type RouteKey } from '../types'

/** 경로별 마지막 RSC 응답 이후 경과 시간을 1초마다 다시 그린다 */
function useNow() {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(performance.now())
    const timer = window.setInterval(() => setNow(performance.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return now
}

export function MeasurementBoard() {
  const { records, fetches } = useStaleTimesLab()
  const now = useNow()
  const lastOf = (route: RouteKey) => [...fetches].reverse().find((f) => f.route === route && f.status === 200)

  return (
    <div className="space-y-3 text-xs">
      <div className="grid gap-2 sm:grid-cols-2">
        {ROUTES.map((route) => {
          const last = lastOf(route)
          return (
            <div key={route} className="rounded border border-zinc-200 p-2 font-mono text-[11px] dark:border-zinc-800">
              <p className="font-sans font-semibold">{ROUTE_LABEL[route]} — 마지막 RSC 응답</p>
              <p>
                {last && now !== null
                  ? `${Math.round((now - last.startedAt) / 1000)}초 전 · ${last.prefetch ? 'prefetch' : '일반'} · x-nextjs-stale-time=${last.staleTime ?? '없음'}`
                  : '아직 없음'}
              </p>
            </div>
          )
        })}
      </div>
      <div className="max-w-full overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left font-mono text-[11px]">
          <thead className="text-zinc-500">
            <tr>
              <th className="py-1 pr-2">#</th>
              <th className="py-1 pr-2">도착</th>
              <th className="py-1 pr-2">직전 응답 후</th>
              <th className="py-1 pr-2">이동 중 RSC 요청</th>
              <th className="py-1 pr-2">prefetch</th>
              <th className="py-1 pr-2">렌더 ID</th>
              <th className="py-1 pr-2">소요</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-2 text-zinc-500">아직 측정한 이동이 없습니다. 위의 &lt;Link&gt;로 두 page를 오가세요.</td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.seq} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="py-1 pr-2">{r.seq}</td>
                  <td className="py-1 pr-2">{ROUTE_LABEL[r.route]}</td>
                  <td className="py-1 pr-2">{r.ageSec === null ? '첫 응답' : `${r.ageSec}초`}</td>
                  <td className="py-1 pr-2">{r.navRequests}건</td>
                  <td className="py-1 pr-2">{r.prefetchRequests}건</td>
                  <td className="py-1 pr-2">
                    {r.renderId} {r.prevRenderId === null ? '(첫 방문)' : r.prevRenderId === r.renderId ? '(재사용)' : '(새 렌더)'}
                  </td>
                  <td className="py-1 pr-2">{r.durationMs}ms</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
