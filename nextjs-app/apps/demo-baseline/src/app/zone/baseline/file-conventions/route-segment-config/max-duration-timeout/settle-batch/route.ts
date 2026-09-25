import type { SettlementBatchResult } from '../types'
import { MAX_ORDER_COUNT, MIN_ORDER_COUNT } from '../types'

/**
 * 이 Route Handler 세그먼트 고유의 maxDuration 선언.
 * page.tsx의 선언(6초, Server Action 몫)과는 완전히 독립적이다 — 같은 데모 안에서도
 * 세그먼트마다 다른 상한을 따로 줄 수 있다는 것을 보여주기 위해 일부러 더 타이트한 3초로 둔다.
 */
export const maxDuration = 3

/** 주문 1건을 정산하는 데 실제로 소요시키는 지연(ms). actions.ts와 같은 값이다. */
const PER_ORDER_SETTLEMENT_MS = 700

async function settleOneOrder(): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, PER_ORDER_SETTLEMENT_MS))
}

/**
 * POST /zone/baseline/file-conventions/route-segment-config/max-duration-timeout/settle-batch
 * 주문 정산 배치를 실제로 순차 처리하고, 이 모듈이 선언한 maxDuration을 응답에 그대로 실어 보낸다.
 *
 * 로컬 next dev/start에서 이 핸들러는 처리 시간이 위 maxDuration(3초)을 넘어도 강제 종료되지 않는다.
 * maxDuration은 Next.js 빌드 출력에 실려 "배포 플랫폼"(Vercel 등)에 전달되는 값이며,
 * 실제 강제 종료는 그 플랫폼의 서버리스 함수 런타임이 수행한다 — 이 프로세스 안에서는 관찰할 수 없다.
 */
export async function POST(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as { orderCount?: unknown } | null
  const rawCount = typeof body?.orderCount === 'number' ? body.orderCount : MIN_ORDER_COUNT
  const safeCount = Math.min(Math.max(Math.trunc(rawCount) || MIN_ORDER_COUNT, MIN_ORDER_COUNT), MAX_ORDER_COUNT)

  const startedAt = Date.now()
  for (let i = 0; i < safeCount; i += 1) {
    await settleOneOrder()
  }
  const finishedAt = Date.now()
  const elapsedMs = finishedAt - startedAt

  const result: SettlementBatchResult = {
    source: 'route-handler',
    orderCount: safeCount,
    perOrderMs: PER_ORDER_SETTLEMENT_MS,
    declaredMaxDurationSeconds: maxDuration,
    startedAt: new Date(startedAt).toISOString(),
    finishedAt: new Date(finishedAt).toISOString(),
    elapsedMs,
    exceededDeclaredLimit: elapsedMs > maxDuration * 1000,
  }

  return Response.json(result, { headers: { 'Cache-Control': 'no-store' } })
}
