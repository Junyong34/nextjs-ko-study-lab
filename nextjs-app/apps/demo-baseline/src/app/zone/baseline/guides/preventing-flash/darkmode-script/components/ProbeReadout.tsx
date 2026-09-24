'use client'

import { useEffect, useState } from 'react'
import { frameText, ms, summarize, type ProbeSummary } from '../lib/summarize'

/** 하위 라우트 자체의 측정값을 보여 준다 (단독으로 열었을 때 확인용). */
export function ProbeReadout() {
  const [summary, setSummary] = useState<ProbeSummary | null>(null)

  useEffect(() => {
    const id = window.setInterval(() => {
      const probe = window.__darkmodeScriptProbe
      if (!probe) return
      setSummary(summarize(probe))
      if (probe.done) window.clearInterval(id)
    }, 200)
    return () => window.clearInterval(id)
  }, [])

  if (!summary) return <p className="font-mono text-[11px] text-zinc-500">측정 중...</p>

  const rows: [string, string][] = [
    ['목표 테마(저장값 판정)', summary.target],
    ['첫 프레임', frameText(summary.firstFrame)],
    ['FCP', ms(summary.fcp)],
    ['인라인 스크립트 적용', summary.scriptAt ? `${summary.scriptAt.theme} @ ${ms(summary.scriptAt.t)}` : '-'],
    ['하이드레이션(첫 useEffect)', `${ms(summary.hydratedAt)} / 당시 data-theme=${summary.themeAtHydration ?? '-'}`],
    ['잘못된 테마 프레임', `${summary.wrongFrames}프레임 (${ms(summary.wrongMs)})`],
    ['최종', frameText(summary.finalFrame)],
    ['hydration 경고', `${summary.errors.length}건`],
  ]

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-zinc-500">{k}</dt>
          <dd className="break-all">{v}</dd>
        </div>
      ))}
      {!summary.done && <dd className="col-span-2 text-amber-600">측정 진행 중...</dd>}
    </dl>
  )
}
