import React from 'react'

interface SegmentRevalidateDemoProps {
  renderId: string
  generatedAt: string
}

export function SegmentRevalidateDemo({ renderId, generatedAt }: SegmentRevalidateDemoProps) {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b pb-3 dark:border-zinc-800">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100">export const revalidate = 10 실증 콘솔</h4>
        <p className="text-xs text-zinc-500">이 페이지의 최상단에 선언된 revalidate 값이 실제로 이 렌더 결과의 유효 기간을 정한다.</p>
      </div>
      <div className="rounded border border-zinc-200 bg-zinc-950 p-3.5 font-mono text-xs text-zinc-300 dark:border-zinc-800 space-y-1.5">
        <div>renderId (서버가 이 세그먼트를 재계산할 때만 바뀜): <span className="text-emerald-400 font-bold">{renderId}</span></div>
        <div>generatedAt: {generatedAt}</div>
        <div>revalidate: 10초</div>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        10초 안에 새로고침하면 renderId가 그대로 유지됩니다(캐시 재사용). 10초가 지난 뒤 새로고침하면 다음 요청에서 Next.js가 백그라운드로 재계산해 renderId가 바뀝니다.
      </p>
    </div>
  )
}
