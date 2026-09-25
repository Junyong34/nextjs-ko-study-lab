'use client'

import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import { useRouterCacheLab } from './RouterCacheProvider'
import { KIND_LABEL, ROUTE_LABEL, groupOf } from '../types'

const TH = 'px-2 py-1.5 text-left font-semibold'
const TD = 'px-2 py-1.5 align-top'

/** 이동 1회마다 브라우저가 실측한 값을 순서대로 보여준다. */
export function MeasurementBoard() {
  const { records, reset } = useRouterCacheLab()
  const isProd = process.env.NODE_ENV === 'production'

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-[11px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {isProd ? 'production (next start)' : 'development (next dev)'}
        </span>
        <DemoResetButton onReset={reset} label="측정 기록 초기화" />
      </div>
      <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[640px] text-[11px]">
          <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className={TH}>#</th>
              <th className={TH}>이동 방식</th>
              <th className={TH}>도착</th>
              <th className={TH}>렌더 ID (서버 시각)</th>
              <th className={TH}>서버 재렌더</th>
              <th className={TH}>RSC 요청</th>
              <th className={TH}>이동→커밋</th>
            </tr>
          </thead>
          <tbody className="font-mono text-zinc-800 dark:text-zinc-200">
            {records.length === 0 && (
              <tr>
                <td className={`${TD} font-sans text-zinc-500`} colSpan={7}>
                  아직 측정 기록이 없습니다. 위 조작부로 이동해 보세요.
                </td>
              </tr>
            )}
            {records.map((r) => {
              const group = groupOf(r.kind)
              return (
                <tr key={r.seq} className="border-t border-zinc-100 dark:border-zinc-800">
                  <td className={TD}>{r.seq}</td>
                  <td className={`${TD} font-sans ${group === 'history' ? 'font-semibold' : ''}`}>
                    {KIND_LABEL[r.kind]}
                    {r.afterRefresh && <span className="block text-[10px] font-normal text-amber-700 dark:text-amber-400">refresh 이후 복원</span>}
                  </td>
                  <td className={`${TD} font-sans`}>{ROUTE_LABEL[r.route]}</td>
                  <td className={TD}>
                    {r.renderId} <span className="text-zinc-500">({r.renderedAt.slice(11, 23)})</span>
                  </td>
                  <td className={`${TD} font-sans`}>{r.kind === 'document' ? '최초 렌더' : r.reused ? '없음 (ID 재사용)' : '있음 (새 ID)'}</td>
                  <td className={TD} title={r.rscPaths.join('\n')}>
                    {r.rscCount === null ? '-' : `${r.rscCount}건`}
                    {r.otherFetches > 0 && <span className="text-zinc-500"> (+다른 경로 {r.otherFetches}건)</span>}
                    {r.rscPaths.length > 0 && (
                      <span className="block max-w-[200px] truncate text-[10px] text-zinc-500">{r.rscPaths[0]}</span>
                    )}
                  </td>
                  <td className={TD}>{r.durationMs === null ? '-' : `${r.durationMs}ms`}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
