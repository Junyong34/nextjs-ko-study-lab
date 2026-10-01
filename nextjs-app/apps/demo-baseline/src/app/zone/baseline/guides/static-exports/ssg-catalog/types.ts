export interface CatalogProduct {
  id: string
  name: string
  price: number
}

/** 같은 URL을 한 번 요청해 얻은 측정값. renderedAt은 상품 페이지가 HTML에 심은 서버 렌더 시각이다. */
export interface ProbeSample {
  status: number
  renderedAt: string | null
  nodeEnv: string | null
  cacheControl: string | null
  nextjsCache: string | null
  nextjsPrerender: string | null
  /** 클라이언트가 응답을 받은 시각(ms). 렌더 후 경과 시간(age) 계산에만 쓴다. */
  receivedAt: number
}

/** 같은 id를 간격을 두고 두 번 요청한 결과 */
export interface ProbeRun {
  id: string
  url: string
  samples: ProbeSample[]
}

export type RenderMode = 'development' | 'production' | 'unknown'

export interface CheckItem {
  label: string
  ok: boolean
  detail: string
}

export interface Judgement {
  /** 사전 생성 id 1개 + 사전 생성되지 않은 id 1개를 측정하기 전에는 false */
  ready: boolean
  mode: RenderMode
  checks: CheckItem[]
  /** 이 서버 모드에서 판정할 수 없는 항목 안내 */
  unverified: string | null
}
