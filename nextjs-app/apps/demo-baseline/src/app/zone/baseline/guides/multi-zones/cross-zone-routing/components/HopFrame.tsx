'use client'
import React, { type RefObject } from 'react'
import type { HopKind, HopRecord } from '../types'
import { HOP_PATH, ZONE_LABEL } from '../lib/zone'

interface Props {
  frameRef: RefObject<HTMLIFrameElement | null>
  frameKey: number
  onLoad: () => void
  pending: HopKind | null
  hops: HopRecord[]
  onBack: () => void
}

const KIND_LABEL: Record<HopKind, string> = {
  'link-same': '<Link> 같은 zone',
  'a-same': '<a> 같은 zone',
  'link-cross': '<Link> cache zone',
  'a-cross': '<a> cache zone',
}

export function HopFrame({ frameRef, frameKey, onLoad, pending, hops, onBack }: Props) {
  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          이동 실험 (iframe: <code>{HOP_PATH.split('/').slice(-2).join('/')}</code>)
        </p>
        <button
          onClick={onBack}
          className="rounded border border-zinc-300 px-3 py-1 text-xs font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 cursor-pointer"
        >
          출발 화면으로
        </button>
      </div>
      <iframe
        key={frameKey}
        ref={frameRef}
        src={HOP_PATH}
        onLoad={onLoad}
        title="zone 이동 실험"
        className="h-56 w-full rounded border border-zinc-300 bg-white dark:border-zinc-700"
      />
      <div className="space-y-1 rounded border border-zinc-200 bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300 dark:border-zinc-800">
        {pending && <div className="text-amber-400">{KIND_LABEL[pending]} 클릭 후 관찰 중... (최대 8초)</div>}
        {hops.length === 0 && !pending && <div className="text-zinc-500">iframe 안의 링크를 누르면 결과가 쌓입니다.</div>}
        {hops.map((h) => (
          <div key={h.kind}>
            <span className="font-bold text-sky-400">{KIND_LABEL[h.kind]}</span>
            {' → '}
            {h.newDocument ? <span className="text-emerald-400">새 문서 로드 ({h.navType})</span> : <span className="text-amber-300">같은 문서 유지</span>}
            {' · '}
            <span className="break-all">{h.path}</span> · {ZONE_LABEL[h.zone]} · 화면 {h.screen ?? '(표식 없음)'}
          </div>
        ))}
      </div>
    </div>
  )
}
