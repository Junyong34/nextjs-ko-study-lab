import React from 'react'
import type { ProbeResult } from '../types'

/** 각 요청의 실제 응답(상태·content-type·x-nextjs-cache·DOMParser 파싱 결과)을 그대로 보여준다. */
export function ProbeResultTable({ results }: { results: ProbeResult[] }) {
  if (results.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-500 dark:border-zinc-700">
        대기 중: [실제 sitemap XML 요청]을 누르면 분할 파일과 대조용 URL을 차례로 요청합니다.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[640px] text-left text-[11px]">
        <thead className="bg-zinc-50 text-zinc-600 dark:bg-zinc-900/60 dark:text-zinc-400">
          <tr>
            <th className="px-3 py-2 font-semibold">요청</th>
            <th className="px-3 py-2 font-semibold">상태 · content-type</th>
            <th className="px-3 py-2 font-semibold">루트 / 항목 수</th>
            <th className="px-3 py-2 font-semibold">첫 loc → 끝 loc</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 font-mono dark:divide-zinc-800">
          {results.map((r) => (
            <tr key={r.path} className="align-top text-zinc-800 dark:text-zinc-200">
              <td className="px-3 py-2">
                <div className="font-semibold">{r.label}</div>
                <div className="text-[10px] text-zinc-500">
                  {(r.bytes / 1024).toFixed(1)} KB · x-nextjs-cache: {r.cacheHeader ?? '없음'}
                </div>
              </td>
              <td className={`px-3 py-2 ${r.status === 200 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {r.status} · {r.contentType ?? '-'}
              </td>
              <td className="px-3 py-2">
                {r.rootTag ? `<${r.rootTag}> ${r.entryCount.toLocaleString()}개` : '-'}
              </td>
              <td className="break-all px-3 py-2 text-[10px] text-zinc-600 dark:text-zinc-400">
                {r.firstLoc ? (
                  <>
                    {r.firstLoc}
                    <br />→ {r.lastLoc}
                  </>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
