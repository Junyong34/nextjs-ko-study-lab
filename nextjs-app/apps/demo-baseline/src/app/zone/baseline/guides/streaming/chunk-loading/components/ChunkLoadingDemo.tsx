'use client'
import React, { useState } from 'react'

export function ChunkLoadingDemo() {
  const [chunks, setChunks] = useState<string[]>(['초기 셸 (0ms)'])
  const loadNext = () => {
    if (chunks.length === 1) setChunks(prev => [...prev, '1차 청크: 상품 기본 스펙 (300ms)'])
    else if (chunks.length === 2) setChunks(prev => [...prev, '2차 청크: 실시간 고객 리뷰 (800ms)'])
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">수신된 스트리밍 청크: {chunks.length} / 3</span>
        <button type="button" onClick={loadNext} disabled={chunks.length >= 3} className="rounded bg-zinc-900 px-3 py-1 text-xs font-bold text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer">
          {chunks.length >= 3 ? '스트림 수신 완료' : '다음 청크 수신'}
        </button>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 space-y-2">
        {chunks.map((c, i) => (
          <div key={i} className="flex items-center gap-2 rounded bg-white p-2.5 text-xs font-mono border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
            <span className="rounded bg-emerald-600 px-1.5 py-0.2 text-[10px] font-bold text-white">CHUNK #{i+1}</span>
            <span>{c}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
