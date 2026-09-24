'use client'

import Link from 'next/link'
import { markClick } from '../lib/navTiming'
import type { LaneSummary } from '../lib/summarize'
import { HoverPrefetchLink, NoPrefetchLink, RouterPrefetchLink } from './PrefetchLinks'
import { DEST_IDS, LANES, destHref, laneOf, type LaneKey } from '../types'

const LINK_CLASS =
  'block rounded border border-zinc-300 bg-white px-2.5 py-1.5 font-mono text-[11px] text-zinc-800 hover:border-blue-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200'

function LaneLink({ lane, id }: { lane: LaneKey; id: string }) {
  const props = { href: destHref(id), className: LINK_CLASS, onClick: () => markClick(id) }
  const label = `상품 ${id.toUpperCase()} 상세`
  if (lane === 'a') return <Link {...props}>{label}</Link>
  if (lane === 'b') return <NoPrefetchLink {...props}>{label}</NoPrefetchLink>
  if (lane === 'c') return <HoverPrefetchLink {...props}>{label}</HoverPrefetchLink>
  return <RouterPrefetchLink {...props}>{label}</RouterPrefetchLink>
}

export function LaneBoard({ summary }: { summary: Record<LaneKey, LaneSummary> }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {LANES.map((lane) => {
        const s = summary[lane.key]
        return (
          <div key={lane.key} className="space-y-2 rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {lane.key.toUpperCase()}. {lane.title}
              </div>
              <code className="text-[10px] text-zinc-500">{lane.code}</code>
              <div className="text-[10px] text-zinc-500">{lane.note}</div>
            </div>
            <div className="space-y-1.5">
              {DEST_IDS.filter((id) => laneOf(id) === lane.key).map((id) => (
                <LaneLink key={id} lane={lane.key} id={id} />
              ))}
            </div>
            <dl className="grid grid-cols-2 gap-x-2 border-t border-zinc-200 pt-2 font-mono text-[10px] dark:border-zinc-800">
              <dt className="text-zinc-500">클릭 전 RSC 요청</dt>
              <dd className="font-bold">
                {s.prefetchRequests}건 ({s.prefetchedLinks}/3 링크, {(s.prefetchBytes / 1024).toFixed(1)}KB)
              </dd>
              <dt className="text-zinc-500">서버 layout 렌더</dt>
              <dd className="font-bold">{s.layoutRenders}회</dd>
              <dt className="text-zinc-500">서버 page 렌더</dt>
              <dd className="font-bold">{s.pageRenders}회</dd>
            </dl>
          </div>
        )
      })}
    </div>
  )
}
