'use server'

import { revalidatePath } from 'next/cache'
import { restockToInitial, sellOneUnit } from './lib/inventoryStore'
import type { StockActionResult } from './types'

const DEMO_PATH = '/zone/baseline/functions/use-router/refresh-server-sync'

function nowLabel(): string {
  return new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/**
 * 다른 사용자가 방금 이 상품을 구매했다고 가정하고 서버 재고를 실제로 1개 줄인다.
 * 의도적으로 revalidatePath/refresh를 호출하지 않는다 — 이 액션만으로는
 * 현재 라우트의 서버 컴포넌트가 다시 렌더링되지 않고, 반환값만 클라이언트로 전달된다.
 */
export async function sellOneUnitAction(): Promise<StockActionResult> {
  const stock = sellOneUnit()
  return { stock, changedAt: nowLabel() }
}

/**
 * 재고를 초기값으로 되돌리고 revalidatePath를 호출한다.
 * [예제 초기화]를 눌렀을 때는 화면도 같은 응답 안에서 즉시 최신 상태로 보이게 하기 위함이다.
 */
export async function restockAction(): Promise<StockActionResult> {
  const stock = restockToInitial()
  revalidatePath(DEMO_PATH)
  return { stock, changedAt: nowLabel() }
}
