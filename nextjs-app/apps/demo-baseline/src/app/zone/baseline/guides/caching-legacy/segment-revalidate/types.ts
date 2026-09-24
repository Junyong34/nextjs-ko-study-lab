export type RouteKey = 'isr-10s' | 'static'

export interface RouteSpec {
  key: RouteKey
  /** BASE_PATH 아래 실제 폴더 이름 */
  segment: string
  /** 이 page 파일에 선언된 route segment config (표시용) */
  config: string
}

/** 브라우저가 하위 page를 실제로 한 번 GET 요청해서 관측한 값 */
export interface ProbeSample {
  seq: number
  route: RouteKey
  /** 관측 시작 후 경과 시간(ms, 브라우저 시계) */
  elapsedMs: number
  /** 응답을 받은 시각(epoch ms, 브라우저 시계) */
  receivedAt: number
  status: number
  renderId: string | null
  /** HTML에 박힌 서버 렌더 시각(ISO) */
  renderedAt: string | null
  xNextjsCache: string | null
  /** Vercel 배포에서는 CDN이 캐시를 처리하므로 이 헤더로 상태가 드러난다 */
  xVercelCache: string | null
  cacheControl: string | null
}

export type RunMode = 'development' | 'production'

/** 수집된 샘플을 실행 모드 기준으로 판정한 결과 */
export interface FlowAnalysis {
  /** 판정할 만큼 샘플이 모였는지 */
  ready: boolean
  isMatched: boolean | undefined
  lines: string[]
}
