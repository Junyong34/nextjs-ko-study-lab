import { SCENARIOS, type OrderStatusResult, type ScenarioKey } from './types'

/**
 * dev 서버 프로세스 메모리에 사는 실제 상태. `next dev`는 요청마다 새로 렌더링하므로
 * page.tsx가 실행될 때마다(=실제 서버 요청이 발생할 때마다) 이 카운터가 실제로 증가한다.
 */
const attemptCounters: Record<ScenarioKey, number> = {
  transient: 0,
  permanent: 0,
}

function buildResult(scenario: ScenarioKey, attempt: number): OrderStatusResult {
  const { recoverAfter } = SCENARIOS[scenario]
  return { scenario, attempt, recoverAfter, succeeded: attempt >= recoverAfter }
}

/** 실제 요청 1회를 카운터에 반영하고 성공/실패를 판정한다. page.tsx에서만 호출한다. */
export function checkOrderStatus(scenario: ScenarioKey): OrderStatusResult {
  attemptCounters[scenario] += 1
  return buildResult(scenario, attemptCounters[scenario])
}

/** 카운터를 변경하지 않고 현재 상태만 읽는다. error.tsx의 진단 표시용. */
export function peekOrderStatus(scenario: ScenarioKey): OrderStatusResult {
  return buildResult(scenario, attemptCounters[scenario])
}

export function resetOrderStatusStore(): void {
  attemptCounters.transient = 0
  attemptCounters.permanent = 0
}
