'use client'

import React from 'react'
import { useNavTiming } from './NavTimingProvider'
import { firstFeedbackMs, totalMs } from '../verification'
import { VARIANTS, VARIANT_LABEL, type NavMeasurement } from '../types'

function fmt(ms: number | null) {
  return ms === null ? '—' : `${ms}ms`
}

/** 클릭 → (이전 화면 유지) → 스켈레톤 → 최종 콘텐츠 구간을 실측값 비율로 그린다. */
function TimelineBar({ m, scale }: { m: NavMeasurement; scale: number }) {
  const total = totalMs(m)
  const first = firstFeedbackMs(m)
  if (total === null || first === null) {
    return <div className="h-2.5 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
  }
  const pct = (v: number) => `${Math.max((v / scale) * 100, 0.8)}%`
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded bg-zinc-100 dark:bg-zinc-900" aria-hidden>
      <div className="bg-rose-300 dark:bg-rose-800" style={{ width: pct(first) }} title="이전 화면 그대로 (피드백 없음)" />
      {m.skeletonAt !== null && (
        <div className="bg-amber-300 dark:bg-amber-700" style={{ width: pct(total - first) }} title="스켈레톤 표시" />
      )}
      <div className="w-1 bg-emerald-500" title="최종 콘텐츠" />
    </div>
  )
}

export function TimingBoard() {
  const { results, active } = useNavTiming()
  const rows = VARIANTS.map((v) => (active && active.variant === v && active.contentAt === null ? active : results[v]))
  const scale = Math.max(1, ...rows.map((m) => (m ? (totalMs(m) ?? 0) : 0)))

  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">브라우저 실측 (performance.now + MutationObserver)</h4>
        <div className="flex gap-3 text-[10px] text-zinc-500">
          <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-rose-300" />이전 화면 유지</span>
          <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-amber-300" />스켈레톤</span>
          <span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-emerald-500" />최종 콘텐츠</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[34rem] text-left font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
          <thead className="text-zinc-500">
            <tr>
              <th className="py-1 pr-2 font-medium">경로</th>
              <th className="py-1 pr-2 font-medium">클릭→첫 피드백</th>
              <th className="py-1 pr-2 font-medium">클릭→스켈레톤</th>
              <th className="py-1 pr-2 font-medium">클릭→최종</th>
              <th className="py-1 pr-2 font-medium">서버 대기</th>
              <th className="py-1 pr-2 font-medium">클릭 전 prefetch</th>
              <th className="w-1/4 py-1 font-medium">타임라인</th>
            </tr>
          </thead>
          <tbody>
            {VARIANTS.map((v, i) => {
              const m = rows[i]
              return (
                <tr key={v} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="py-1.5 pr-2 font-sans font-semibold">{VARIANT_LABEL[v]}</td>
                  {m ? (
                    <>
                      <td className="py-1.5 pr-2 font-bold">{fmt(firstFeedbackMs(m))}</td>
                      <td className="py-1.5 pr-2">{m.skeletonAt === null ? (m.contentAt === null ? '대기' : '없음') : fmt(Math.round(m.skeletonAt - m.clickAt))}</td>
                      <td className="py-1.5 pr-2">{m.contentAt === null ? '측정 중…' : fmt(totalMs(m))}</td>
                      <td className="py-1.5 pr-2">{fmt(m.serverMs)}</td>
                      <td className="py-1.5 pr-2">{m.prefetchBeforeClick}건 / {m.prefetchBytes}B</td>
                      <td className="py-1.5"><TimelineBar m={m} scale={scale} /></td>
                    </>
                  ) : (
                    <td colSpan={6} className="py-1.5 font-sans text-zinc-500">아직 측정 전 — 위 링크를 클릭하세요.</td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
