import React from 'react'
import type { HtmlAnalysis } from '../types'

function Column({ analysis, label }: { analysis: HtmlAnalysis; label: string }) {
  const fouc = analysis.unstyledClasses.length > 0
  return (
    <div className="space-y-2 rounded border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{label}</span>
        <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${fouc ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'}`}>
          {fouc ? 'FOUC 발생' : 'FOUC 없음'}
        </span>
      </div>
      <div className="font-mono text-[11px] text-zinc-500">
        HTTP {analysis.status} · style {analysis.styleTagCount}개(head {analysis.headTagCount}) · 사용 요소 {analysis.usageCount}회 · 규칙 {analysis.ruleClasses.length}개
      </div>
      <pre className="whitespace-pre-wrap break-all rounded bg-zinc-950 p-2 text-[10px] leading-relaxed text-zinc-300">{analysis.snippet}</pre>
    </div>
  )
}

export function ServerProbePanel({ withRegistry, withoutRegistry }: { withRegistry: HtmlAnalysis; withoutRegistry: HtmlAnalysis }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Column analysis={withRegistry} label="registry 있음" />
      <Column analysis={withoutRegistry} label="registry 없음 (대조군)" />
    </div>
  )
}
