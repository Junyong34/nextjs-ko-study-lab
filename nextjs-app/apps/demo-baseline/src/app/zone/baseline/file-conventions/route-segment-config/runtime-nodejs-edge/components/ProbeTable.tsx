import React from 'react'
import { PROBE_ROWS } from '../expectations'
import { PROBE_SEGMENTS, SEGMENT_DECLARATION, type ProbeResult, type ProbeSegment } from '../types'

function Cell({ segment, result, rowIndex }: { segment: ProbeSegment; result: ProbeResult; rowIndex: number }) {
  if (result.status === 'loading') {
    return <td className="px-3 py-2 text-zinc-400">측정 중...</td>
  }
  if (result.status === 'error') {
    return <td className="px-3 py-2 text-rose-600 dark:text-rose-400">요청 실패: {result.message}</td>
  }
  const row = PROBE_ROWS[rowIndex]
  const value = result.data[row.field]
  const ok = row.check(segment, result.data)
  return (
    <td
      className={`px-3 py-2 align-top break-all ${
        ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
      }`}
      title={`기대: ${row.expected[segment]}`}
    >
      {value === null ? 'null' : JSON.stringify(value)}
    </td>
  )
}

export function ProbeTable({
  pathname,
  results,
}: {
  pathname: string
  results: Record<ProbeSegment, ProbeResult>
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[640px] border-collapse font-mono text-[11px]">
        <thead className="bg-zinc-50 text-left dark:bg-zinc-900/60">
          <tr>
            <th className="px-3 py-2 font-semibold text-zinc-600 dark:text-zinc-400">측정 항목</th>
            {PROBE_SEGMENTS.map((segment) => (
              <th key={segment} className="px-3 py-2 align-top">
                <a
                  href={`${pathname}/${segment}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-blue-700 hover:underline dark:text-blue-400"
                >
                  GET ./{segment}
                </a>
                <div className="mt-0.5 font-normal text-zinc-500">{SEGMENT_DECLARATION[segment]}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {PROBE_ROWS.map((row, rowIndex) => (
            <tr key={row.field}>
              <th scope="row" className="px-3 py-2 text-left font-semibold text-zinc-800 dark:text-zinc-200">
                {row.label}
              </th>
              {PROBE_SEGMENTS.map((segment) => (
                <Cell key={segment} segment={segment} result={results[segment]} rowIndex={rowIndex} />
              ))}
            </tr>
          ))}
          <tr>
            <th scope="row" className="px-3 py-2 text-left font-normal text-zinc-500">
              measuredAt (서버 시각)
            </th>
            {PROBE_SEGMENTS.map((segment) => {
              const result = results[segment]
              return (
                <td key={segment} className="px-3 py-2 text-zinc-500">
                  {result.status === 'ok' ? result.data.measuredAt : '-'}
                </td>
              )
            })}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
