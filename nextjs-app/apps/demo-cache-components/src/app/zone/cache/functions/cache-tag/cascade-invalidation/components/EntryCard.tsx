import React from 'react'
import type { CacheEntrySnapshot } from '../types'

export type EntryState = 'idle' | 'recomputed' | 'kept'

const LEVEL_LABEL: Record<CacheEntrySnapshot['level'], string> = {
  catalog: '상위',
  category: '카테고리',
  product: '상품',
}

const STATE_STYLE: Record<EntryState, string> = {
  idle: 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950',
  recomputed: 'border-amber-400 bg-amber-50/60 dark:border-amber-700 dark:bg-amber-950/30',
  kept: 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60',
}

interface EntryCardProps {
  entry: CacheEntrySnapshot
  state: EntryState
  previousCacheId?: string
  highlightTag?: string
}

export function EntryCard({ entry, state, previousCacheId, highlightTag }: EntryCardProps) {
  return (
    <div className={`rounded-md border p-2.5 text-xs transition-colors ${STATE_STYLE[state]}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{entry.label}</span>
        <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {LEVEL_LABEL[entry.level]}
        </span>
      </div>
      <div className="mt-0.5 text-[11px] text-zinc-500">{entry.detail}</div>

      <div className="mt-2 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
        cacheId <strong className="text-emerald-700 dark:text-emerald-400">#{entry.cacheId}</strong>
        <span className="ml-2 text-zinc-500">{entry.generatedAt}</span>
      </div>
      {state === 'recomputed' && previousCacheId && (
        <div className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
          재계산됨: #{previousCacheId} → #{entry.cacheId}
        </div>
      )}
      {state === 'kept' && (
        <div className="font-mono text-[11px] text-zinc-500">유지됨: 이전과 같은 cacheId</div>
      )}

      <ul className="mt-2 flex flex-wrap gap-1" aria-label="부착된 태그">
        {entry.tags.map((tag) => (
          <li
            key={tag}
            className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
              tag === highlightTag
                ? 'bg-rose-600 text-white'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
          >
            {tag.replace('functions-cache-tag-cascade-invalidation:', '')}
          </li>
        ))}
      </ul>
    </div>
  )
}
