import React from 'react'
import { safeDecode, type ParamsObservation } from '../types'

/** 서버 page가 await params로 받은 값을 가공 없이 표로 보여준다. */
export function ParamsObservationTable({ observation }: { observation: ParamsObservation }) {
  const rows: Array<{ expr: string; value: string }> = [
    { expr: 'JSON.stringify(await params)', value: observation.paramsJson },
    { expr: 'Object.keys(await params)', value: JSON.stringify(observation.keys) },
    { expr: "'slug' in (await params)", value: String(observation.hasSlugKey) },
    { expr: 'typeof slug', value: JSON.stringify(observation.typeofSlug) },
    { expr: 'Array.isArray(slug)', value: String(observation.isArray) },
    { expr: 'slug?.length', value: String(observation.length ?? undefined) },
    { expr: 'JSON.stringify(slug)', value: observation.slugJson },
  ]

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left font-mono text-[11px]">
          <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900/60 dark:text-zinc-400">
            <tr>
              <th className="px-3 py-1.5 font-semibold">식 (서버에서 평가)</th>
              <th className="px-3 py-1.5 font-semibold">실제 값</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {rows.map((r) => (
              <tr key={r.expr}>
                <td className="whitespace-nowrap px-3 py-1.5 text-zinc-500 dark:text-zinc-400">{r.expr}</td>
                <td className="break-all px-3 py-1.5 font-semibold text-zinc-900 dark:text-zinc-100">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {observation.items.length > 0 && (
        <ol className="space-y-1 text-[11px]">
          {observation.items.map((item, i) => (
            <li
              key={i}
              className="flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <span className="text-zinc-500">slug[{i}]</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{JSON.stringify(item)}</span>
              <span className="text-zinc-400">decodeURIComponent → {JSON.stringify(safeDecode(item))}</span>
              <span className="text-zinc-400">
                {safeDecode(item) === item ? '받은 값 = 디코딩 값' : '받은 값 ≠ 디코딩 값 (인코딩된 채로 수신)'}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
