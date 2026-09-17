import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'functions/connection/request-signal/static-branch',
)

import React from 'react'
import { StockProbeCard } from '../components/StockProbeCard'
import { rollLiveStock } from '../types'

export default function StaticBranchPage() {
  // connection()을 호출하지 않는다 — Request-time API를 전혀 쓰지 않으므로
  // Next.js는 이 페이지를 build 시점에 한 번만 렌더링해 정적으로 캐시하려 시도한다.
  // (next dev에서는 모든 페이지가 항상 요청마다 새로 렌더링되므로, 이 정적 캐시 자체는
  // `pnpm build` 결과의 ○ Static 표시로만 확인할 수 있다 — 하단 [개념 정리] 참고)
  const stock = rollLiveStock()
  const renderedAt = new Date().toISOString()

  return (
    <div className="space-y-2.5">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        이 브랜치는 connection()을 호출하지 않아 요청 시점을 기다리는 지점이 없다.
      </p>
      <StockProbeCard mode="static" stock={stock} renderedAt={renderedAt} />
    </div>
  )
}
