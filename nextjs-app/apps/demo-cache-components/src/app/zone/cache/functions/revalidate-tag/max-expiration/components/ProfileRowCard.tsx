import React from 'react'
import { PROFILES } from '../tags'
import type { ProfileId, RowView } from '../types'

export function formatExpire(seconds: number) {
  if (seconds >= 60 * 60 * 24 * 365) return `${seconds / (60 * 60 * 24 * 365)}년`
  if (seconds >= 60 * 60 * 24) return `${seconds / (60 * 60 * 24)}일`
  return `${seconds}초`
}

interface Props {
  profileId: ProfileId
  view: RowView
  disabled: boolean
  onMeasure: () => void
}

/** 가격표 한 줄 = 독립된 'use cache' 엔트리 하나. 캐시가 돌려준 버전과 원본 버전을 나란히 보여 준다. */
export function ProfileRowCard({ profileId, view, disabled, onMeasure }: Props) {
  const row = PROFILES[profileId]
  const inSync = view.cached.version === view.source.version

  return (
    <div className="space-y-2.5 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-bold text-zinc-900 dark:text-zinc-100">{row.name}</div>
          <code className="block break-all font-mono text-[11px] text-zinc-700 dark:text-zinc-300">{row.code}</code>
        </div>
        <span className="shrink-0 rounded border border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          expire {formatExpire(row.expireSeconds)}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-2 font-mono text-[11px]">
        <div className="rounded bg-white p-2 dark:bg-zinc-950">
          <dt className="font-sans text-zinc-500">캐시가 돌려준 값</dt>
          <dd className="font-bold text-zinc-900 dark:text-zinc-100">v{view.cached.version}</dd>
          <dd className="text-zinc-500">#{view.cached.cacheId} · {view.cached.generatedAt}</dd>
        </div>
        <div className="rounded bg-white p-2 dark:bg-zinc-950">
          <dt className="font-sans text-zinc-500">원본(서버 메모리)</dt>
          <dd className="font-bold text-zinc-900 dark:text-zinc-100">v{view.source.version}</dd>
          <dd className={inSync ? 'text-emerald-600' : 'text-amber-600'}>{inSync ? '캐시와 같음' : '캐시가 뒤처짐'}</dd>
        </div>
      </dl>

      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-mono text-[10px] text-zinc-400" title={row.tag}>
          {row.tag}
        </span>
        <button
          type="button"
          onClick={onMeasure}
          disabled={disabled}
          className="shrink-0 cursor-pointer rounded bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          가격 변경 후 1·2회차 요청
        </button>
      </div>
    </div>
  )
}
