import React, { Suspense } from 'react'
import { connection } from 'next/server'
import { getProductSnapshot } from '../../cachedData'
import { SnapshotReporter } from '../../components/SnapshotReporter'

// id마다 내용이 전부 다른 leaf 페이지라 정적 셸이 없다 — instant navigation 검증 대상에서 제외한다.
export const instant = false

// generateStaticParams를 두지 않는다: 빌드 시 프리렌더된 값이 비교를 오염시키지 않도록
// 모든 id가 요청 시점에 렌더되고, 캐시 값은 오직 'use cache' 엔트리에서만 온다.
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-3 font-mono text-xs text-zinc-400">요청 중...</div>}>
      <ProductSnapshotView params={params} />
    </Suspense>
  )
}

async function ProductSnapshotView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await connection()
  const cached = await getProductSnapshot(id)
  const requestedAt = new Date().toLocaleTimeString('ko-KR', { hour12: false })

  return (
    <div className="space-y-1 p-3 font-mono text-xs">
      <div className="font-sans font-bold text-zinc-900 dark:text-zinc-100">상품 /products/{id}</div>
      <div>
        cacheId <span className="font-bold text-emerald-600 dark:text-emerald-400">#{cached.cacheId}</span>
      </div>
      <div className="text-zinc-500">캐시 생성 {cached.cachedAt}</div>
      <div className="text-zinc-400">요청 시각 {requestedAt}</div>
      <SnapshotReporter snapshot={{ ...cached, requestedAt }} />
    </div>
  )
}
