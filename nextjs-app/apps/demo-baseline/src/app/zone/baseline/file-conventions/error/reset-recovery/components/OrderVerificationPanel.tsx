'use client'

import { ExpectedActualPanel } from '@study/demo-kit'
import { SCENARIOS, type ScenarioKey } from '../types'

export interface OrderVerificationPanelProps {
  scenario: ScenarioKey
  phase: 'success' | 'fail'
  /** 서버에서 실제로 읽은 attempt 값. 조회 중이면 undefined. */
  attempt?: number
}

/**
 * expected/actual을 전부 SCENARIOS 설정값과 서버가 실제로 반환한 attempt로 계산한다.
 * 하드코딩된 true/false 없음 — attempt가 바뀌면 isMatched도 실제로 바뀐다.
 */
export function OrderVerificationPanel({ scenario, phase, attempt }: OrderVerificationPanelProps) {
  const config = SCENARIOS[scenario]
  const isPermanent = !Number.isFinite(config.recoverAfter)

  const expected = isPermanent
    ? `• recoverAfter가 무한대(설정 오류 미해결)이므로 attempt와 무관하게 항상 실패해야 함`
    : `• attempt < ${config.recoverAfter}이면 실패, attempt >= ${config.recoverAfter}이면 성공해야 함`

  const actual =
    typeof attempt !== 'number'
      ? '• 서버 카운터 조회 중...'
      : phase === 'success'
        ? `• 실제 attempt=${attempt}에서 성공 응답 수신`
        : `• 실제 attempt=${attempt}에서도 실패 응답 수신`

  const isMatched =
    typeof attempt !== 'number'
      ? undefined
      : phase === 'success'
        ? attempt >= config.recoverAfter
        : isPermanent || attempt < config.recoverAfter

  return (
    <ExpectedActualPanel
      title={`${config.label} (${config.orderId}) 실제 서버 상태 검증`}
      expected={expected}
      actual={actual}
      isMatched={isMatched}
      description="attempt는 화면 표시용 숫자가 아니라 page.tsx가 서버에서 실제로 실행된 횟수(store.ts의 카운터)입니다."
    />
  )
}
