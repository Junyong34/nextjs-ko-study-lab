export type RouteKey = 'static' | 'headers' | 'search-params' | 'connection'

export interface RouteSpec {
  key: RouteKey
  /** BASE_PATH 아래 실제 폴더 이름 */
  segment: string
  /** 실측 요청에 붙일 쿼리 접두사 (요청 번호가 뒤에 붙는다) */
  probeQuery: string
  /** page 본문이 호출하는 런타임 API */
  api: string
  code: string
  /** next build 라우트 표에서 기대하는 기호 */
  expectedSymbol: '○' | 'ƒ'
}

/** fetch 한 번으로 실제 관측한 값 */
export interface ProbeSample {
  status: number
  renderId: string | null
  renderedAt: string | null
  xNextjsCache: string | null
  xNextjsPrerender: string | null
  cacheControl: string | null
}

export interface RouteProbeResult {
  route: RouteSpec
  samples: ProbeSample[]
  uniqueIds: number
  /** 이 실행 환경(dev/prod)에서의 기대와 일치하는지 */
  ok: boolean
}

export type RunMode = 'development' | 'production'
