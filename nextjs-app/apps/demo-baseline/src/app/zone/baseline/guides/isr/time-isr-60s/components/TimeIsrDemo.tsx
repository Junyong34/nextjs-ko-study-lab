import React from 'react'

interface TimeIsrDemoProps {
  renderId: string
  generatedAt: string
}

export function TimeIsrDemo({ renderId, generatedAt }: TimeIsrDemoProps) {
  return (
    <div className="rounded border border-zinc-200 bg-white p-4 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">상품 상세 정적 스냅샷 (#ITEM-8921)</span>
        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">export const revalidate = 60</span>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1.5">
        <div>
          renderId (서버가 이 세그먼트를 재계산할 때만 바뀜): <span className="text-emerald-400 font-bold">{renderId}</span>
        </div>
        <div>generatedAt: {generatedAt}</div>
        <div>revalidate: 60초</div>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        60초 안에 새로고침하면 renderId가 그대로 유지됩니다(정적 캐시 재사용). 60초가 지난 뒤 새로고침하면 Next.js가 그 요청에 기존 캐시를 먼저 반환하고 백그라운드에서 페이지를 재생성해, 다음 요청부터 새 renderId로 바뀝니다.
      </p>
    </div>
  )
}
