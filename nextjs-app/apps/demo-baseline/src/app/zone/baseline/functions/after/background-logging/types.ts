/** 서버 프로세스 메모리에 남는 실제 감사 로그 엔트리. 요청마다 초기화되는 mock이 아니다. */
export interface AuditLogEntry {
  orderId: string
  /** Server Action 함수 본문이 반환되기 직전에 서버에서 기록한 시각 (T1) */
  responseReturnedAt: number
  /** after() 콜백이 실제로 실행되기 시작한 시각 (T2). 아직 실행 전이면 null */
  afterStartedAt: number | null
  /** after() 콜백이 카드 정보 해시 마스킹까지 마치고 완료된 시각 (T3). 아직 완료 전이면 null */
  afterCompletedAt: number | null
  /** PBKDF2로 마스킹한 카드 결제 식별자 해시 (앞 16자만 노출) */
  maskedCardDigest: string | null
}

export interface SubmitOrderResult {
  orderId: string
  orderNumber: string
  amount: number
  responseReturnedAt: number
}

export type DemoPhase = 'idle' | 'submitting' | 'waiting-after' | 'completed' | 'timeout'
