'use client'

import React from 'react'
import { FIELD_RULES } from '../shaping'
import type { ComparisonResult } from '../types'

const pre =
  'max-h-72 overflow-auto rounded bg-zinc-100 p-2.5 font-mono text-[10.5px] leading-snug text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200'

/** 받은 본문을 그대로 보여 주고, BFF가 적용한 변환 규칙(shaping.ts의 FIELD_RULES)을 표로 그린다. */
export function JsonPanels({ result }: { result: ComparisonResult }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="min-w-0 space-y-1.5">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            레거시 원본 <span className="font-mono font-normal text-zinc-500">{result.legacy.url}</span>
          </h4>
          <pre className={pre}>{JSON.stringify(result.legacy.body, null, 2)}</pre>
        </section>
        <section className="min-w-0 space-y-1.5">
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            BFF 가공 응답 <span className="font-mono font-normal text-zinc-500">{result.bff.url}</span>
          </h4>
          <pre className={pre}>{JSON.stringify(result.bff.body, null, 2)}</pre>
        </section>
      </div>
      <section className="space-y-1.5">
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">BFF 필드 매핑 (shaping.ts FIELD_RULES — 실제 변환에 쓰는 배열)</h4>
        <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
          <table className="w-full min-w-[520px] text-left text-[11px]">
            <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900/60">
              <tr>
                <th className="px-3 py-1.5 font-semibold">가공 필드</th>
                <th className="px-3 py-1.5 font-semibold">원본 경로</th>
                <th className="px-3 py-1.5 font-semibold">변환</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-mono dark:divide-zinc-800">
              {FIELD_RULES.map((r) => (
                <tr key={r.key}>
                  <td className="px-3 py-1.5 text-zinc-900 dark:text-zinc-100">{r.key}</td>
                  <td className="px-3 py-1.5 text-zinc-600 dark:text-zinc-400 break-all">{r.from}</td>
                  <td className="px-3 py-1.5 font-sans text-zinc-600 dark:text-zinc-400">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-zinc-500 break-keep">
          규칙에 없는 원본 키(원가·마진·공급사 계약·창고 내부 SKU·관리자 감사 로그·내부 메모·서버 노드 등)는 선택되지 않으므로 응답에서 빠집니다.
        </p>
      </section>
    </div>
  )
}
