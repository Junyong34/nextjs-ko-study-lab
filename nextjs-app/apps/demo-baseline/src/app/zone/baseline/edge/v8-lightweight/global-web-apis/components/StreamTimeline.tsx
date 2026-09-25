'use client'

import React from 'react'
import { STREAM_CHUNKS, STREAM_INTERVAL_MS, type ObservedChunk } from '../types'

const SCALE_MS = STREAM_CHUNKS * STREAM_INTERVAL_MS + 400

/** stream/route.ts의 NDJSON 청크가 브라우저에 도착한 시각을 막대로 표시한다. */
export function StreamTimeline({ chunks, headersAtMs }: { chunks: ObservedChunk[]; headersAtMs?: number }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] text-zinc-500">
        fetch 시작을 0ms로 두고, <code>reader.read()</code>로 각 줄을 받은 시각을 기록했습니다.
        {headersAtMs !== undefined && <> 응답 헤더 도착: {headersAtMs}ms.</>}
      </p>
      <ol className="space-y-1.5">
        {Array.from({ length: STREAM_CHUNKS }, (_, i) => {
          const c = chunks.find((x) => x.seq === i)
          return (
            <li key={i} className="grid grid-cols-[2.5rem_1fr] items-center gap-2 font-mono text-[11px]">
              <span className="text-zinc-500">#{i}</span>
              <div className="min-w-0">
                <div className="relative h-5 rounded bg-zinc-100 dark:bg-zinc-900">
                  {c && (
                    <div
                      className="absolute inset-y-0 left-0 rounded bg-blue-200/80 dark:bg-blue-900/60"
                      style={{ width: `${Math.min(100, (c.arrivedMs / SCALE_MS) * 100)}%` }}
                    />
                  )}
                  <span className="relative px-2 leading-5 text-zinc-800 dark:text-zinc-200">
                    {c ? `도착 ${c.arrivedMs}ms · 서버 ${c.serverElapsedMs}ms` : '대기 중'}
                  </span>
                </div>
                {c && (
                  <div className="mt-0.5 break-all text-[10.5px] text-zinc-500">
                    part=&quot;{c.part}&quot; → transformed=&quot;{c.transformed}&quot;
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
