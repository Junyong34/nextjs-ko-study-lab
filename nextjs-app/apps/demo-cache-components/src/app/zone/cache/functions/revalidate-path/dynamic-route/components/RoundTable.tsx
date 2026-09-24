import React from 'react'
import { PRODUCT_IDS } from '../paths'
import type { RoundResult } from '../types'

/** 직전 실행 전후 cacheId를 id별로 나란히 놓고, 실제로 재생성된 id를 표시한다. */
export function RoundTable({ round }: { round: RoundResult }) {
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="break-all font-mono text-[11px] text-zinc-700 dark:text-zinc-300">실행: {round.call}</div>
      <div className="overflow-x-auto">
        <table className="w-full font-mono text-[11px]">
          <thead className="text-left text-zinc-500">
            <tr>
              <th className="py-1 pr-3 font-medium">경로</th>
              <th className="py-1 pr-3 font-medium">이전 cacheId</th>
              <th className="py-1 pr-3 font-medium">이후 cacheId</th>
              <th className="py-1 font-medium">결과</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCT_IDS.map((id) => {
              const changed = round.actualChanged.includes(id)
              return (
                <tr key={id} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="py-1 pr-3">/products/{id}</td>
                  <td className="py-1 pr-3">#{round.before[id]?.cacheId}</td>
                  <td className="py-1 pr-3">#{round.after[id]?.cacheId}</td>
                  <td className={`py-1 font-sans font-semibold ${changed ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'}`}>
                    {changed ? '재생성됨' : '캐시 유지'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
