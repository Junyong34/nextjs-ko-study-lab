'use client'
import React from 'react'
import { RENDER_LABELS, SITE_LABELS, type ProbeSite, type ProbeSnapshot, type RenderSite } from '../types'

interface Props {
  probe: ProbeSnapshot | null
  onRefresh: () => void
}

/** 서버 프로세스 메모리의 누적 카운터 (api/probe GET 응답 그대로) */
export function ProbeTable({ probe, onRefresh }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">서버 카운터 누적값 (GET api/probe)</h5>
        <button
          type="button"
          onClick={onRefresh}
          className="cursor-pointer rounded border border-zinc-300 px-2 py-0.5 text-[11px] text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          다시 읽기
        </button>
      </div>
      {!probe ? (
        <p className="text-[11px] text-zinc-500">서버 카운터 읽는 중...</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ul className="space-y-1 rounded border border-zinc-200 bg-zinc-50 p-2.5 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-900/50">
            {(Object.keys(probe.sites) as ProbeSite[]).map((site) => (
              <li key={site} className="flex justify-between gap-2">
                <span className="text-zinc-600 dark:text-zinc-400">{SITE_LABELS[site].condition}</span>
                <span>
                  직전 {probe.sites[site].reached} /{' '}
                  <span className={probe.sites[site].after === 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}>
                    다음 줄 {probe.sites[site].after}
                  </span>
                </span>
              </li>
            ))}
            {(Object.keys(probe.rendered) as RenderSite[]).map((site) => (
              <li key={site} className="flex justify-between gap-2">
                <span className="text-zinc-600 dark:text-zinc-400">{RENDER_LABELS[site]}</span>
                <span>{probe.rendered[site]}</span>
              </li>
            ))}
          </ul>
          <ol className="max-h-48 space-y-0.5 overflow-y-auto rounded border border-zinc-200 bg-zinc-950 p-2.5 font-mono text-[10px] text-zinc-300 dark:border-zinc-800">
            {probe.events.length === 0 && <li className="text-zinc-500">기록 없음</li>}
            {probe.events.map((e) => (
              <li key={e.seq} className={e.kind === 'before-notFound' ? 'text-amber-300' : e.kind === 'after-notFound' ? 'text-rose-400' : 'text-emerald-400'}>
                #{e.seq} {e.at.slice(11, 23)} {e.kind} · {e.detail}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
