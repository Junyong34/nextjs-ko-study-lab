'use client'
import type { MetaTagRow } from '../types'

export function MetaTagTable({ title, rows, emptyText }: { title: string; rows: MetaTagRow[]; emptyText: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800">
      <div className="border-b border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200">
        {title} <span className="font-mono font-normal text-zinc-500">({rows.length}개)</span>
      </div>
      {rows.length === 0 ? (
        <p className="p-3 text-xs text-zinc-500">{emptyText}</p>
      ) : (
        <table className="w-full table-fixed text-left font-mono text-[11px]">
          <tbody>
            {rows.map((row, i) => (
              <tr key={`${row.key}-${i}`} className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/60">
                <td className="w-40 px-3 py-1 align-top text-zinc-900 dark:text-zinc-100">{row.key}</td>
                <td className="break-all px-2 py-1 text-zinc-600 dark:text-zinc-400">{row.content}</td>
                <td className="w-14 px-2 py-1 align-top text-zinc-500">{row.inHead ? 'head' : 'body'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
