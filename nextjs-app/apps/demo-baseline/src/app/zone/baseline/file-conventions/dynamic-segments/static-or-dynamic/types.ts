export type RunMode = 'development' | 'production'

export interface RouteSpec {
  key: string
  /** BASE_PATH 아래 실제 요청 경로 (동적 세그먼트에 넣은 샘플 값 포함) */
  path: string
  /** page 파일 위치 */
  file: string
  /** 이 라우트를 만드는 조건 */
  condition: string
  /** next build 라우트 표에서 기대하는 기호 (실측으로 확정한 값) */
  expectedSymbol: '○' | '●' | 'ƒ'
  /** production에서 같은 URL을 N번 요청했을 때 기대하는 고유 렌더 ID 수 ('all'이면 요청 수만큼) */
  prodUniqueIds: 1 | 'all'
}

/** fetch 한 번으로 실제 관측한 값 */
export interface ProbeSample {
  status: number
  renderId: string | null
  xNextjsCache: string | null
  xNextjsPrerender: string | null
  cacheControl: string | null
}

export interface RouteProbeResult {
  route: RouteSpec
  samples: ProbeSample[]
  uniqueIds: number
  ok: boolean
}
