'use client'

import React from 'react'
import type { CallStatus, TimelineEvent } from '../types'

const STATUS_STYLE: Record<CallStatus, string> = {
  MISS: 'bg-amber-600',
  HIT: 'bg-emerald-600',
  STALE: 'bg-violet-600',
}

const time = (iso: string) => new Date(iso).toTimeString().slice(0, 8)

/** 이번 세션의 호출·무효화·DB 변경 기록 (최신이 위) */
export function CallTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="rounded-md border border-zinc-200 p-3 dark:border-zinc-800">
      <div className="mb-2 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">호출 기록</div>
      {events.length === 0 ? (
        <p className="text-[11px] text-zinc-500">아직 실행한 조작이 없습니다.</p>
      ) : (
        <ol aria-label="호출 기록" className="max-h-80 space-y-1.5 overflow-y-auto pr-1">
          {[...events].reverse().map((e) => (
            <li key={e.seq} className="rounded border border-zinc-100 px-2 py-1.5 text-[11px] dark:border-zinc-800/70">
              {e.type === 'call' ? (
                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-zinc-400">#{e.seq}</span>
                    <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold text-white ${STATUS_STYLE[e.record.status]}`}>
                      {e.record.status}
                    </span>
                    <code className="text-zinc-800 dark:text-zinc-200">{e.record.label}</code>
                  </div>
                  <div className="font-mono text-[10px] text-zinc-500">
                    runId #{e.record.runId} · 실행 {time(e.record.executedAtIso)} · 결과 나이 {e.record.ageSec}초 ·
                    카운터 {e.record.countBefore}→{e.record.countAfter} · executedAt 타입 {e.record.executedAtType}
                    {e.record.fromOtherProcess && ' · 이전 서버 프로세스가 저장한 엔트리'}
                  </div>
                  <div className="text-zinc-600 dark:text-zinc-400">{e.record.summary}</div>
                </div>
              ) : e.type === 'invalidate' ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-zinc-400">#{e.seq}</span>
                  <span className="rounded bg-rose-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">TAG</span>
                  <code className="text-zinc-700 dark:text-zinc-300">updateTag(&apos;{e.tag}&apos;)</code>
                  <span className="font-mono text-[10px] text-zinc-400">{time(e.atIso)}</span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-zinc-400">#{e.seq}</span>
                  <span className="rounded bg-zinc-600 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white">DB</span>
                  <code className="text-zinc-700 dark:text-zinc-300">
                    UPDATE products SET price = {e.newPrice.toLocaleString('ko-KR')} WHERE id = &apos;{e.productId}&apos;
                  </code>
                  <span className="font-mono text-[10px] text-zinc-400">{time(e.atIso)}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
