'use client'

import type { LayoutChange, LayoutGroup } from '../types'

type Props = {
  shown: LayoutGroup[]
  confirmed: LayoutGroup[]
  onMove: (change: LayoutChange) => void
}

function groupOf(groups: LayoutGroup[], channelId: string) {
  return groups.find((g) => g.channels.some((c) => c.id === channelId))?.name
}

/** 화면 표시 전용. 낙관적 위치와 확정 위치가 다른 채널에 "저장 중" 표시를 붙인다. */
export function LayoutBoard({ shown, confirmed, onMove }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {shown.map((group) => (
        <section
          key={group.name}
          aria-label={group.name}
          className="rounded-md border border-zinc-300 p-3 dark:border-zinc-700"
        >
          <h4 className="mb-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {group.name} <span className="font-normal text-zinc-500">({group.channels.length})</span>
          </h4>
          <ul className="space-y-2">
            {group.channels.length === 0 && (
              <li className="text-xs text-zinc-400">비어 있음</li>
            )}
            {group.channels.map((channel) => {
              const saving = groupOf(confirmed, channel.id) !== group.name
              return (
                <li key={channel.id} className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-zinc-900 dark:text-zinc-100">{channel.name}</span>
                    {saving && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                        저장 중
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {shown
                      .filter((g) => g.name !== group.name)
                      .map((target) => (
                        <button
                          key={target.name}
                          type="button"
                          onClick={() =>
                            onMove({ type: 'move', channelId: channel.id, toGroup: target.name })
                          }
                          className="rounded border border-zinc-300 px-1.5 py-0.5 text-[11px] text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          → {target.name}
                        </button>
                      ))}
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
