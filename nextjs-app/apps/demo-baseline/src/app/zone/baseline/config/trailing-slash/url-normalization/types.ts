/** 기본 설정(trailingSlash 미지정 = false)에서 문서가 말하는 두 가지 응답 */
export type ExpectedStatus = 200 | 308

export interface SlashCase {
  id: string
  label: string
  /** 앱 origin 이후의 전체 경로(쿼리 포함). 서버가 이 경로를 그대로 요청한다 */
  path: string
  expectStatus: ExpectedStatus
  /** 기대 Location. 리다이렉트되지 않으면 null */
  expectLocation: string | null
  /** trailingSlash: true였다면 어떻게 되는지(설명, 실측 아님) */
  ifTrue: string
}

/** 서버(Route Handler)가 같은 앱에 fetch(redirect: 'manual')로 보내 읽은 응답 */
export interface ProbeResult {
  caseId: string
  requestedPath: string
  status: number
  statusText: string
  location: string | null
  contentType: string | null
  elapsedMs: number
}

export type ProbeOutcome = ProbeResult | { error: string }

/** 학습자의 사전 예측. null이면 예측하지 않음 */
export type Prediction = ExpectedStatus | null
