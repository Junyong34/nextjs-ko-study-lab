/** 서버(Route Handler)가 같은 앱에 fetch(redirect: 'manual')로 보내 읽어 온 응답 */
export interface ProbeResult {
  requestedPath: string
  status: number
  statusText: string
  /** 리다이렉트가 아니면 null */
  location: string | null
  /** 308 응답에 Next.js가 자동으로 붙이는 Refresh 헤더(IE11 호환용) */
  refresh: string | null
  elapsedMs: number
}

export type ProbeOutcome = ProbeResult | { error: string }

/** 기대 상태: 307/308 = 리다이렉트됨, 404 = 규칙에 일치하지 않아 리다이렉트되지 않음(실제 page도 없음) */
export type ExpectedStatus = 307 | 308 | 404

export interface RedirectCase {
  id: string
  /** 규칙 번호(rules 배열 인덱스, 0부터) */
  rule: number
  label: string
  /** 데모 base 이후의 경로(쿼리 포함). 예: /catalog/2024/1001 */
  path: string
  expectStatus: ExpectedStatus
  /** 데모 base 이후의 기대 Location. 리다이렉트되지 않으면 null */
  expectLocation: string | null
}

/** 학습자의 사전 예측. null이면 예측하지 않음 */
export type Prediction = ExpectedStatus | null
