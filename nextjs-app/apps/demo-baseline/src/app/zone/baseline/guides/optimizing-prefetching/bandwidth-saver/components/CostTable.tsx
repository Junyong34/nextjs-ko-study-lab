'use client'

import { MODES } from '../catalog'
import type { ModeActivity, ModeNetworkStats, PrefetchMode, RenderSnapshot } from '../types'

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

interface CostTableProps {
  mode: PrefetchMode
  network: Record<PrefetchMode, ModeNetworkStats>
  activity: Record<PrefetchMode, ModeActivity>
  renders: RenderSnapshot | null
}

const TH = 'px-2 py-1.5 text-right font-semibold'
const TD = 'px-2 py-1.5 text-right tabular-nums'

export function CostTable({ mode, network, activity, renders }: CostTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full min-w-[36rem] font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
        <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            <th className="px-2 py-1.5 text-left font-semibold">전략</th>
            <th className={TH}>본 링크</th>
            <th className={TH}>hover</th>
            <th className={TH}>prefetch 요청</th>
            <th className={TH}>요청된 상품</th>
            <th className={TH}>transferSize 합</th>
            <th className={TH}>본문 합</th>
            <th className={TH}>서버 layout / page</th>
          </tr>
        </thead>
        <tbody>
          {MODES.map((m) => {
            const n = network[m.key]
            const a = activity[m.key]
            const r = renders?.[m.key]
            return (
              <tr
                key={m.key}
                className={`border-t border-zinc-200 dark:border-zinc-800 ${
                  m.key === mode ? 'bg-zinc-100/70 dark:bg-zinc-800/50' : ''
                }`}
              >
                <td className="px-2 py-1.5 text-left font-sans font-semibold text-zinc-900 dark:text-zinc-100">
                  {m.label}
                </td>
                <td className={TD}>{a.seen}</td>
                <td className={TD}>{a.hovered}</td>
                <td className={`${TD} font-bold text-zinc-900 dark:text-zinc-100`}>{n.requests}건</td>
                <td className={TD}>{n.skus}개</td>
                <td className={TD}>{formatBytes(n.transferBytes)}</td>
                <td className={TD}>{formatBytes(n.bodyBytes)}</td>
                <td className={TD}>{r ? `${r.layout} / ${r.page}` : '…'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
