import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { recordRender } from '../../server-counter'
import { DEST_IDS, LAYOUT_COST_MS, laneOf } from '../../types'

// 비싼 목적지 ①: loading 경계 "위"의 layout.
// 기본 prefetch는 이 layout ~ loading.tsx까지를 미리 받아오므로, 링크가 뷰포트에 들어올 때마다
// 이 서버 작업(LAYOUT_COST_MS 대기 + 렌더 카운트)이 실제로 실행된다.
export default async function DestLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  await connection()
  const { id } = await params
  if (!DEST_IDS.includes(id)) notFound()

  // 느린 공통 데이터 조회(예: 상품 기본 정보 DB)를 대신하는 실제 서버 대기
  await new Promise((resolve) => setTimeout(resolve, LAYOUT_COST_MS))
  recordRender(id, 'layout')

  return (
    <div className="mx-auto max-w-2xl space-y-3 p-6 font-sans">
      <div className="rounded border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-[11px] text-zinc-500">상품 상세 · 레인 {laneOf(id).toUpperCase()}</div>
        <h1 className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">PRODUCT {id.toUpperCase()}</h1>
        <p className="mt-1 text-[11px] text-zinc-500">
          이 머리글은 <code>dest/[id]/layout.tsx</code>가 서버에서 {LAYOUT_COST_MS}ms 걸려 렌더한 결과입니다.
        </p>
      </div>
      {children}
    </div>
  )
}
