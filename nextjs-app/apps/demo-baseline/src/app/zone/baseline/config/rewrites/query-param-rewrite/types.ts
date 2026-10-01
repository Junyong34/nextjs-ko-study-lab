// 목적지 페이지가 자신이 받은 값을 DOM(data-rewrite-probe)에 JSON으로 심어 두면, 실습 화면이 응답 HTML에서 읽어 간다.
export interface DestinationProbe {
  /** 실제로 렌더된 목적지 라우트 파일 */
  destination: 'products/[id]' | 'lookup'
  /** 동적 세그먼트로 받은 params */
  params: Record<string, string>
  /** 목적지가 받은 searchParams (배열 값은 쉼표로 합침) */
  searchParams: Record<string, string>
  renderedAt: string
}

export type ScenarioId = 'query-to-path' | 'path-to-query' | 'value-mismatch' | 'no-query' | 'direct'

/** 실습에서 보낼 수 있는 요청 한 종류. 기대값은 next.config 규칙(rewrites-query.ts)에서 도출한다. */
export interface Scenario {
  id: ScenarioId
  label: string
  /** 데모 base 이하 요청 경로(+쿼리). value는 학습자가 입력한 숫자 */
  buildPath: (value: string) => string
  /** 이 요청에 next.config rewrite 규칙이 적용되어야 하는가 (학습자 예측과 대조) */
  rewritten: boolean
  expectStatus: number
  /** null이면 목적지 페이지 없이 404가 기대된다 */
  expectDestination: DestinationProbe['destination'] | null
  expectParams: (value: string) => Record<string, string>
  expectSearch: (value: string) => Record<string, string>
  note: string
}

/** 한 번의 요청 실측 결과 */
export interface Measurement {
  scenario: ScenarioId
  value: string
  requestedPath: string
  /** fetch가 보고한 응답 URL의 path+search */
  responsePath: string
  status: number
  /** redirect: 'manual'에서 3xx를 만나면 opaqueredirect(status 0) */
  responseType: ResponseType
  probe: DestinationProbe | null
  measuredAt: string
  /** 요청을 보내기 전에 학습자가 고른 예측 */
  prediction: Prediction | null
}

export type Prediction = 'rewritten' | 'not-rewritten'
