/** template.tsx 진입 애니메이션 이벤트 1건 (실제 `animationstart`/`animationend` 리스너가 기록) */
export interface AnimationLogEntry {
  type: 'start' | 'end'
  /** 이 이벤트가 발생한 template 마운트 회차 */
  mountNumber: number
  /** 이벤트 발생 시각 문자열 */
  at: string
}

export interface InputResetState {
  /** template.tsx 누적 마운트 횟수. 세그먼트 이동마다 증가한다. */
  templateMountCount: number
  /** template.tsx가 가장 최근 마운트된 시각 문자열 */
  templateMountedAt: string
  /**
   * 직전 template.tsx 인스턴스가 언마운트되기 직전, 비제어(uncontrolled) 입력의
   * 실제 DOM 값(ref.current.value)을 그대로 캡처한 값. 새 인스턴스는 defaultValue만
   * 가지므로 이 값과 무관하게 항상 빈 문자열로 시작한다.
   */
  lastValueBeforeUnmount: string
  /** animationstart/animationend 리스너가 실측한 이벤트 로그 (최근 N건) */
  animationLog: AnimationLogEntry[]
}
