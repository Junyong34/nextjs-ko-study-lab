export type ScenarioKey = 'transient' | 'permanent'

export interface ScenarioConfig {
  key: ScenarioKey
  orderId: string
  label: string
  causeDescription: string
  /** 이 시도 횟수(attempt) 이상이면 성공. Infinity면 영구적으로 실패. */
  recoverAfter: number
}

export interface OrderStatusResult {
  scenario: ScenarioKey
  attempt: number
  recoverAfter: number
  succeeded: boolean
}

export const SCENARIOS: Record<ScenarioKey, ScenarioConfig> = {
  transient: {
    key: 'transient',
    orderId: 'TX-7781',
    label: '일시적 오류',
    causeDescription: '결제 검증 서버 응답 지연 — 몇 차례 재요청하면 서버 상태가 스스로 회복됩니다.',
    recoverAfter: 3,
  },
  permanent: {
    key: 'permanent',
    orderId: 'TX-9042',
    label: '근본 오류 지속',
    causeDescription: '배송사 연동 코드 설정 오류 — 설정을 고치기 전까지 재요청해도 계속 실패합니다.',
    recoverAfter: Number.POSITIVE_INFINITY,
  },
}
