'use server'

import type { SettlementBatchResult } from './types'
import { MAX_ORDER_COUNT, MIN_ORDER_COUNT } from './types'

/**
 * Server Action은 그 자체로는 maxDuration을 선언할 수 없다.
 * 공식 문서(Server Actions 섹션): 이 액션을 호출하는 page.tsx의
 * `export const maxDuration = 6` 선언이 이 페이지에서 쓰이는 모든 Server Action의
 * 기본 타임아웃을 그대로 결정한다. 아래 상수는 page.tsx의 선언과 반드시 같은 값으로 유지한다.
 */
const PAGE_MAX_DURATION_SECONDS = 6

/** 주문 1건을 정산하는 데 실제로 소요시키는 지연(ms). 외부 PG 정산 API 왕복 + 원장 커밋을 흉내 낸다. */
const PER_ORDER_SETTLEMENT_MS = 700

async function settleOneOrder(): Promise<void> {
  // setTimeout 지연은 실제 서버 wall-clock 시간을 그만큼 소모하는 진짜 비동기 대기다.
  // 화면에서만 흐르는 척하는 가짜 딜레이가 아니라, 이 함수를 호출하는 서버 프로세스가
  // 실제로 이만큼 블로킹 없이 대기한 뒤 다음 주문으로 넘어간다.
  await new Promise<void>((resolve) => setTimeout(resolve, PER_ORDER_SETTLEMENT_MS))
}

/**
 * 주문 정산 배치를 실제로 순차 처리하는 Server Action.
 * 처리 시간은 orderCount에 정비례하며, 이 값을 충분히 크게 선택하면
 * 위 PAGE_MAX_DURATION_SECONDS(6초)를 실제로 넘길 수 있다.
 */
export async function runOrderSettlementBatch(orderCount: number): Promise<SettlementBatchResult> {
  const safeCount = Math.min(Math.max(Math.trunc(orderCount) || MIN_ORDER_COUNT, MIN_ORDER_COUNT), MAX_ORDER_COUNT)

  const startedAt = Date.now()
  for (let i = 0; i < safeCount; i += 1) {
    await settleOneOrder()
  }
  const finishedAt = Date.now()
  const elapsedMs = finishedAt - startedAt

  return {
    source: 'server-action',
    orderCount: safeCount,
    perOrderMs: PER_ORDER_SETTLEMENT_MS,
    declaredMaxDurationSeconds: PAGE_MAX_DURATION_SECONDS,
    startedAt: new Date(startedAt).toISOString(),
    finishedAt: new Date(finishedAt).toISOString(),
    elapsedMs,
    exceededDeclaredLimit: elapsedMs > PAGE_MAX_DURATION_SECONDS * 1000,
  }
}
