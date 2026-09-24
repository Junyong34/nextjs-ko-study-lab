'use client'

import type { MeasurementRow } from '../lib/summarize'

const ms = (v: number | null) => (v === null ? '-' : `${Math.round(v)}ms`)

/** 클릭 → 화면 전환 실측 기록 (이 문서에서 일어난 모든 이동) */
export function MeasurementTable({ rows }: { rows: MeasurementRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded border border-dashed border-zinc-300 p-3 text-center text-[11px] text-zinc-500 dark:border-zinc-700">
        아직 이동 기록이 없습니다. 각 레인의 링크를 클릭해 목적지로 이동했다가 돌아오세요.
      </p>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left font-mono text-[11px]">
        <thead className="text-zinc-500">
          <tr>
            <th className="py-1">링크</th>
            <th>클릭 전 요청</th>
            <th>클릭 후 요청</th>
            <th>클릭→스켈레톤</th>
            <th>클릭→본문</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.id}-${i}`} className="border-t border-zinc-200 dark:border-zinc-800">
              <td className="py-1 font-bold">{r.id}</td>
              <td>{r.before}건</td>
              <td>{r.after}건</td>
              <td>{ms(r.loadingMs)}</td>
              <td>{ms(r.contentMs)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
