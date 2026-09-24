'use client'

import React from 'react'
import { CATEGORIES } from '../tags'
import type { DbSnapshot } from '../types'

/** 캐시를 거치지 않은 원본 테이블 (Server Action 응답마다 갱신) */
export function DbTablePanel({ snapshot }: { snapshot: DbSnapshot }) {
  return (
    <div className="rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">원본 DB: products</span>
        <span className="font-mono text-[10px] text-zinc-500">
          쿼리 실행 {snapshot.executions}회 · 프로세스 {snapshot.bootId}
        </span>
      </div>
      <table className="w-full text-left text-[11px]">
        <tbody>
          {snapshot.rows.map((row) => (
            <tr key={row.id} className="border-t border-zinc-100 dark:border-zinc-800/70">
              <td className="py-1 pr-2 font-mono text-zinc-500">{row.id}</td>
              <td className="py-1 pr-2 text-zinc-500">{CATEGORIES[row.category]}</td>
              <td className="py-1 pr-2 text-zinc-800 dark:text-zinc-200">{row.name}</td>
              <td className="py-1 text-right font-mono text-zinc-800 dark:text-zinc-200">
                {row.price.toLocaleString('ko-KR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
