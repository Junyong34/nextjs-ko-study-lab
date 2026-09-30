export type TaintCaseId = 'safe' | 'object' | 'value' | 'derived'

export interface TaintCaseResult {
  case: TaintCaseId
  /** 서버 액션 호출이 예외로 reject되었는지(= React가 직렬화를 막았는지). */
  blocked: boolean
  /** 클라이언트가 실제로 받은 값 또는 받은 에러 메시지. */
  message: string
  /** 응답에 원본 시크릿 문자열이 그대로 들어 있었는지. 클라이언트가 응답을 검사해 측정한다. */
  secretLeaked: boolean
  timestamp: string
}

export type TaintDemoState = Record<TaintCaseId, TaintCaseResult | null>

export const EMPTY_STATE: TaintDemoState = { safe: null, object: null, value: null, derived: null }

/** 데모용 가짜 시크릿. 서버 파일의 값과 같아야 클라이언트가 유출 여부를 판별할 수 있다. */
export const DEMO_SECRET_PREFIX = 'sk_live_DEMO'
