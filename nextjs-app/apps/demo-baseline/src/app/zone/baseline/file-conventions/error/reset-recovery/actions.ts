'use server'

import { peekOrderStatus, resetOrderStatusStore } from './store'
import type { OrderStatusResult, ScenarioKey } from './types'

/** error.tsx(클라이언트)가 서버 카운터의 실제 값을 조회하기 위한 Server Action. */
export async function peekOrderStatusAction(scenario: ScenarioKey): Promise<OrderStatusResult> {
  return peekOrderStatus(scenario)
}

/** [서버 카운터 초기화] 버튼에서 호출. 두 시나리오의 attempt를 0으로 되돌린다. */
export async function resetOrderStatusAction(): Promise<void> {
  resetOrderStatusStore()
}
