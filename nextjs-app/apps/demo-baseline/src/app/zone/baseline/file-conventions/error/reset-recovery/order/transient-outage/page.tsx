import Link from 'next/link'
import { checkOrderStatus } from '../../store'
import { SCENARIOS } from '../../types'
import { OrderVerificationPanel } from '../../components/OrderVerificationPanel'

// 이 세그먼트는 매 방문마다 실제로 다시 렌더링되어야 데모 전제(실제 재요청)가 성립한다.
export const dynamic = 'force-dynamic'

const BASE_PATH = '/zone/baseline/file-conventions/error/reset-recovery'
const config = SCENARIOS.transient

export default function TransientOutagePage() {
  // 실제 서버 카운터를 증가시키고, 아직 회복 기준(recoverAfter) 미만이면 진짜로 throw한다.
  const result = checkOrderStatus('transient')

  if (!result.succeeded) {
    throw new Error(`주문 ${config.orderId} 상태 조회 실패 — ${config.causeDescription}`)
  }

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 text-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100">주문 {config.orderId} 상태 조회</h4>
          <p className="text-xs text-zinc-500">
            page.tsx가 실제로 {result.attempt}번째 서버 요청을 처리했습니다.
          </p>
        </div>
        <Link
          href={BASE_PATH}
          className="rounded bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
        >
          ← 데모 홈
        </Link>
      </div>
      <div className="rounded border border-emerald-300 bg-emerald-50 p-4 text-xs text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
        [정상] 결제 완료 · 배송 준비 중 (일시적 오류가 실제로 해소됨)
      </div>
      <OrderVerificationPanel scenario="transient" phase="success" attempt={result.attempt} />
    </div>
  )
}
