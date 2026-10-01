export type ZoneId = 'cache' | 'baseline'

export type ScenarioId = 'zone-page' | 'api-og' | 'upstream-404' | 'control'

/** 실습에서 보낼 수 있는 요청 한 종류. 기대값은 next.config 규칙(rewrites-cross-zone.ts)에서 도출한다. */
export interface Scenario {
  id: ScenarioId
  label: string
  /** 데모 base 이하 요청 경로(+쿼리). title은 학습자가 입력한 OG 제목 */
  buildPath: (title: string) => string
  /** 이 요청이 cache zone으로 프록시되어야 하는가 */
  proxied: boolean
  kind: 'html' | 'image'
  expectStatus: number
  expectZone: ZoneId
  note: string
}

/** 응답이 어느 zone에서 만들어졌는지 판단한 근거 */
export interface ZoneEvidence {
  zone: ZoneId | null
  /** 판정에 쓴 실측 근거(사람이 읽는 문장) */
  basis: string
}

/** 한 번의 요청 실측 결과 */
export interface Measurement {
  scenario: ScenarioId
  title: string
  requestedPath: string
  /** fetch가 보고한 응답 URL의 path+search */
  responsePath: string
  status: number
  /** 3xx를 따라갔다면 true (rewrite는 3xx를 만들지 않는다) */
  redirected: boolean
  contentType: string
  /** 업스트림(cache zone)은 poweredByHeader 기본값(true), baseline은 false */
  poweredBy: string | null
  evidence: ZoneEvidence
  /** image 시나리오: 프록시 응답과 baseline 자체 /og 이미지(같은 title)의 object URL */
  imageUrl: string | null
  baselineImageUrl: string | null
  /** 5xx일 때 응답 본문 앞부분 (프록시 실패 메시지 확인용) */
  errorBody: string | null
  measuredAt: string
  /** 요청을 보내기 전에 학습자가 고른 예측 */
  prediction: ZoneId | null
}
