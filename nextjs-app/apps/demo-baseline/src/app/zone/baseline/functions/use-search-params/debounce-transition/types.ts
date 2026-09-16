/** 키 입력 후 URL 쿼리를 실제로 커밋하기까지 대기하는 디바운스 지연(ms) */
export const DEBOUNCE_MS = 300

/** 실습화면/검증 패널에 노출할 최근 로그 최대 개수 */
export const MAX_LOG_ENTRIES = 6

/** 키보드 입력 1건의 실측 타임스탬프 */
export interface KeystrokeEntry {
  value: string
  /** performance.now() 기준 입력 시각 */
  atMs: number
}

/** useTransition().isPending 값이 실제로 바뀐 시점의 실측 기록 */
export interface TransitionEdge {
  type: 'start' | 'end'
  /** performance.now() 기준 전환 시각 */
  atMs: number
  /** 직전 키 입력으로부터 경과한 시간(ms) */
  sinceLastKeystrokeMs: number
}

/** URL 쿼리로 실제 커밋된 마지막 검색어와, 그 커밋에 걸린 실측 지연 */
export interface LastCommit {
  query: string
  /** 키 입력 시각 → router.replace 호출 시각까지 실측 지연(ms) */
  keystrokeToCommitMs: number
}
