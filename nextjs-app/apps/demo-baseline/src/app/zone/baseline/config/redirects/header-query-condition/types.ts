import type { ConditionRuleId } from '@/config/demo-next-config/redirects-condition'

export type { ConditionRuleId }

/** 학습자가 폼에서 구성하는 요청. 빈 문자열은 "그 조건 요소를 보내지 않음"이다. */
export interface ProbeInput {
  rule: ConditionRuleId
  /** x-beta-tester 헤더 값 */
  header: string
  /** demo_beta 쿠키 값 */
  cookie: string
  /** ?ref= 쿼리 값 */
  query: string
  /** Host 헤더 덮어쓰기 값 */
  host: string
  /** x-skip-redirect 헤더를 보낼지 여부 (missing 규칙용) */
  skip: boolean
}

/** 서버가 실제로 보낸 요청의 정규화된 모습. 기대값 계산과 화면 표시가 같은 원본을 쓴다. */
export interface SentRequest {
  rule: ConditionRuleId
  pathname: string
  /** '?'로 시작하거나 빈 문자열 */
  search: string
  /** 소문자 헤더 이름 → 값 (host 제외, cookie 포함) */
  headers: Record<string, string>
  /** 실제로 요청에 실은 Host 헤더 값 */
  host: string
}

/** Server Action이 redirect:'manual'로 요청해 측정한 응답 */
export interface ProbeOutcome {
  sent: SentRequest
  status: number | null
  location: string | null
  /** 리다이렉트되지 않았을 때 Route Handler가 돌려준 본문 */
  body: string | null
  error: string | null
}

export interface Verdict {
  expectRedirect: boolean
  expectedLocation: string | null
  matched: boolean
  reason: string
}

export interface ProbeEntry {
  id: number
  input: ProbeInput
  outcome: ProbeOutcome
  verdict: Verdict
}
