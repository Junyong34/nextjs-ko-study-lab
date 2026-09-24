import { connection } from 'next/server'
import { recordRender } from '../../server-counter'
import { PAGE_COST_MS } from '../../types'
import { ArrivalReport } from '../../components/ArrivalReport'

// 비싼 목적지 ②: loading 경계 "아래"의 page. 요청마다 새로 계산되는 동적 데이터라
// 어떤 prefetch 전략(기본·hover)도 미리 받지 않고, 클릭 후 이동 요청에서만 실행된다.
export default async function DestPage({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params

  // 요청 시점 데이터(예: 실시간 재고) 조회를 대신하는 실제 서버 대기
  await new Promise((resolve) => setTimeout(resolve, PAGE_COST_MS))
  recordRender(id, 'page')
  const renderedAt = new Date().toLocaleTimeString('ko-KR', { hour12: false })

  return (
    <div className="space-y-3">
      <div className="rounded border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
        실시간 재고 확인 완료 · 서버 렌더 시각 {renderedAt} (<code>dest/[id]/page.tsx</code>, {PAGE_COST_MS}ms)
      </div>
      <ArrivalReport id={id} />
    </div>
  )
}
