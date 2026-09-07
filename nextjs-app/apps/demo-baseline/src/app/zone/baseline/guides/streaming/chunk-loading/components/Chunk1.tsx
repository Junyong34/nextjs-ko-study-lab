import React from 'react'

export async function Chunk1() {
  const start = Date.now()
  await new Promise(resolve => setTimeout(resolve, 300))
  const elapsedMs = Date.now() - start
  return (
    <div className="flex items-center gap-2 rounded bg-white p-2.5 text-xs font-mono border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
      <span className="rounded bg-emerald-600 px-1.5 py-0.2 text-[10px] font-bold text-white">CHUNK #2</span>
      <span>1차 청크: 상품 기본 스펙 (실측 {elapsedMs}ms)</span>
    </div>
  )
}
