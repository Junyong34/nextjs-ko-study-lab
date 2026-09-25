'use client'

import React from 'react'
import { displayRel } from '../routes'
import type { ChainNode } from '../types'
import { useObservation } from './ObservationContext'

function nodeLabel(n: ChainNode): string {
  switch (n.kind) {
    case 'html':
      return `<html lang="${n.lang}">`
    case 'body':
      return '<body>'
    case 'layout':
    case 'page':
      return n.file
  }
}

function nodeOwner(n: ChainNode): string {
  if (n.kind === 'html' || n.kind === 'body') return 'app/layout.tsx (루트)'
  return n.kind === 'layout' ? 'data-layout' : 'data-page'
}

/** 현재 경로에서 page 요소의 실제 DOM 조상 체인을 바깥에서 안쪽 순서로 보여 준다. */
export function ChainView() {
  const { currentRel, observations } = useObservation()
  const obs = observations[currentRel]

  return (
    <div className="min-w-0 space-y-2 rounded border border-zinc-200 p-3 dark:border-zinc-800">
      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
        현재 경로 <code className="font-mono font-normal">{displayRel(currentRel)}</code>의 DOM 조상 체인
      </p>
      {!obs ? (
        <p className="text-[11px] text-zinc-500">page 요소가 마운트되면 조상 체인을 읽습니다.</p>
      ) : (
        <ol className="space-y-1 font-mono text-[11px]" data-testid="chain">
          {obs.chain.map((n, i) => (
            <li key={`${i}-${nodeLabel(n)}`} className="flex min-w-0 flex-wrap items-baseline gap-2" style={{ paddingLeft: `${i * 12}px` }}>
              <span className="text-zinc-900 dark:text-zinc-100">{nodeLabel(n)}</span>
              <span className="text-[10px] text-zinc-500">{nodeOwner(n)}</span>
            </li>
          ))}
        </ol>
      )}
      {obs && (
        <p className="break-all text-[11px] text-zinc-600 dark:text-zinc-400">
          html {obs.htmlCount}개 · body {obs.bodyCount}개 · head의 title {obs.headTitleCount}개 · document.title “{obs.title}”
        </p>
      )}
    </div>
  )
}
