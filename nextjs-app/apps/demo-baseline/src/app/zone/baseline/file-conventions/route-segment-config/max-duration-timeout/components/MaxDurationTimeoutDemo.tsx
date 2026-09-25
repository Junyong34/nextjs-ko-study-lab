'use client'

import React from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { useOrderSettlement } from '../hooks/useOrderSettlement'
import { SettlementControls } from './SettlementControls'
import { SettlementVerificationPanel } from './SettlementVerificationPanel'

export interface MaxDurationTimeoutDemoProps {
  /** page.tsx가 실제로 export한 maxDuration 값을 그대로 받는다 (중복 선언하지 않는다). */
  pageMaxDurationSeconds: number
}

/**
 * 2단 [실습 화면] + 3단 [검증] 을 함께 구성한다 (runtime-nodejs-edge 데모와 같은 패턴).
 * 실제 Server Action(actions.ts)과 실제 Route Handler(settle-batch/route.ts)를 호출해
 * 주문 정산 배치를 진짜로 처리하고, 서버가 돌려준 실측값만 화면에 반영한다.
 */
export function MaxDurationTimeoutDemo({ pageMaxDurationSeconds }: MaxDurationTimeoutDemoProps) {
  const {
    orderCount,
    changeOrderCount,
    pendingSource,
    pendingElapsedMs,
    lastOutcome,
    logs,
    runViaServerAction,
    runViaRouteHandler,
    reset,
  } = useOrderSettlement()

  return (
    <>
      <DemoPlaygroundCard title="주문 정산 배치 maxDuration 타임아웃 제한 실습 (./actions.ts, ./settle-batch/route.ts)">
        <SettlementControls
          orderCount={orderCount}
          onChangeOrderCount={changeOrderCount}
          pendingSource={pendingSource}
          pendingElapsedMs={pendingElapsedMs}
          logs={logs}
          pageMaxDurationSeconds={pageMaxDurationSeconds}
          onRunServerAction={runViaServerAction}
          onRunRouteHandler={runViaRouteHandler}
          onReset={reset}
        />
      </DemoPlaygroundCard>

      <SettlementVerificationPanel outcome={lastOutcome} pendingSource={pendingSource} />
    </>
  )
}
