import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata(
  'baseline',
  'functions/connection/request-signal/dynamic-branch',
)

import React, { Suspense } from 'react'
import { connection } from 'next/server'
import { StockProbeCard } from '../components/StockProbeCard'
import { rollLiveStock } from '../types'

export default function DynamicBranchPage() {
  return (
    <div className="space-y-2.5">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        이 문단은 connection() 이전에 위치한 정적 App Shell이라 즉시 렌더링된다.
      </p>
      <Suspense fallback={<ProbeSkeleton />}>
        <LiveStockProbe />
      </Suspense>
    </div>
  )
}

async function LiveStockProbe() {
  await connection() // 정적 prerender가 여기서 중단되고, 아래 코드는 실제 요청 시점에만 실행된다
  // 학습 목적의 인위적 지연 — connection() 자체의 지연이 아니라, 위 App Shell과 이 카드 사이의
  // 스트리밍 경계를 사람 눈으로 볼 수 있게 하기 위함이다.
  await new Promise((resolve) => setTimeout(resolve, 900))

  const stock = rollLiveStock()
  const renderedAt = new Date().toISOString()

  return <StockProbeCard mode="dynamic" stock={stock} renderedAt={renderedAt} />
}

function ProbeSkeleton() {
  return (
    <div className="animate-pulse rounded border border-zinc-200 bg-zinc-100 p-3.5 text-xs text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
      실제 요청 처리 중 (connection() 대기)...
    </div>
  )
}
