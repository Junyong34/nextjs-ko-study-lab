export interface ServerWindowProbeResult {
  /** 서버 렌더링 시점에 실제로 측정한 typeof window 값 (기대: 'undefined') */
  typeofWindow: string
  /** window 접근 시도 중 실제로 발생한 에러 이름. 성공 시 '(에러 없음)' */
  errorName: string
  /** 실제로 발생한 에러 메시지. 성공 시 '(에러 없음)' */
  errorMessage: string
  /** 이 측정이 실행된 실제 시각 (ISO 문자열) */
  checkedAt: string
}
