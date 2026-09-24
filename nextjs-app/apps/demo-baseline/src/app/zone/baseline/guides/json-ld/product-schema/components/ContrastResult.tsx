'use client'
import type { ParseContrast } from '../types'

export function ContrastResult({ items }: { items: ParseContrast[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {items.map((item) => {
        const intact = item.scriptCount === 1 && item.jsonOk && item.injectedCount === 0 && item.descriptionRoundTrip
        return (
          <div
            key={item.label}
            className={`space-y-2 rounded-lg border p-3 text-xs ${
              intact
                ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-800 dark:bg-emerald-950/30'
                : 'border-rose-300 bg-rose-50/40 dark:border-rose-800 dark:bg-rose-950/30'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <code className="break-all font-mono text-[11px] font-semibold text-zinc-900 dark:text-zinc-100">{item.label}</code>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                  intact
                    ? 'bg-emerald-600 text-white dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-rose-600 text-white dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {intact ? '경계 유지' : '경계 끊김'}
              </span>
            </div>
            <ul className="space-y-0.5 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
              <li>script 요소 수: {item.scriptCount}</li>
              <li>script 본문 길이: {item.scriptText.length} / 직렬화 길이: {item.serialized.length}</li>
              <li>JSON.parse: {item.jsonOk ? '성공' : `실패 (${item.jsonError})`}</li>
              <li>description 왕복 일치: {String(item.descriptionRoundTrip)}</li>
              <li>body에 생긴 [data-injected] 요소: {item.injectedCount}</li>
              <li className="break-all">script 밖으로 샌 텍스트: {item.leakedText ? JSON.stringify(item.leakedText) : '(없음)'}</li>
            </ul>
            <pre className="max-h-28 overflow-auto whitespace-pre-wrap break-all rounded bg-[#24292e] p-2 font-mono text-[10px] text-zinc-100">
              {item.scriptText.slice(-160)}
            </pre>
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400">위: 파서가 script 본문으로 인식한 마지막 160자</div>
          </div>
        )
      })}
    </div>
  )
}
