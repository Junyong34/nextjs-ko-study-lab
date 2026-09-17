import Link from 'next/link'
import { checkOrderStatus } from '../../store'
import { SCENARIOS } from '../../types'
import { OrderVerificationPanel } from '../../components/OrderVerificationPanel'

export const dynamic = 'force-dynamic'

const BASE_PATH = '/zone/baseline/file-conventions/error/reset-recovery'
const config = SCENARIOS.permanent

export default function PersistentFaultPage() {
  // recoverAfter가 Infinity라서 attempt가 아무리 늘어도 succeeded는 항상 false다.
  const result = checkOrderStatus('permanent')

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
        [정상] 결제 완료 · 배송 준비 중
      </div>
      <OrderVerificationPanel scenario="permanent" phase="success" attempt={result.attempt} />
    </div>
  )
}
