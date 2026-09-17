import React from 'react'

function formatKstRenderTime(date: Date) {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  const y = kst.getUTCFullYear()
  const m = pad(kst.getUTCMonth() + 1)
  const d = pad(kst.getUTCDate())
  const h = pad(kst.getUTCHours())
  const min = pad(kst.getUTCMinutes())
  const s = pad(kst.getUTCSeconds())
  return `${y}-${m}-${d} ${h}:${min}:${s} KST`
}

export function ServerInfoPanel() {
  const renderedAt = formatKstRenderTime(new Date())
  return (
    <div className="rounded border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-950 dark:bg-blue-950/20 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-blue-950 dark:text-blue-200">️ Server Component (RSC)</span>
        <span className="rounded bg-blue-600 px-1.5 py-0.2 font-mono text-[9px] text-white">0 KB JS</span>
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">요청마다 서버에서 새로 계산되는 실시간 데이터입니다. (새로고침 시 시각 변경)</p>
      <div className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">렌더 타임: {renderedAt}</div>
    </div>
  )
}
