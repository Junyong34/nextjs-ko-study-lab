export type TaintCaseId = 'tainted' | 'untainted'

export interface TaintAttemptResult {
  case: TaintCaseId
  /** true면 React가 실제로 렌더링/직렬화를 차단했다는 뜻 (에러가 발생함) */
  blocked: boolean
  message: string
  /** 차단되지 않고 클라이언트까지 도달한 원시 시크릿 값 (있는 경우만) */
  revealedSecret?: string
  timestamp: string
}

export interface TaintDemoState {
  tainted: TaintAttemptResult | null
  untainted: TaintAttemptResult | null
}
