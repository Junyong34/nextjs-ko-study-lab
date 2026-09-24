/** 카탈로그 링크에 적용하는 prefetch 전략 4종 — 모두 공식 prefetching 가이드에 있는 방법이다. */
export type PrefetchMode = 'full' | 'auto' | 'hover' | 'off'

export interface ModeConfig {
  key: PrefetchMode
  label: string
  /** 학습자에게 보여줄 실제 코드 조각 */
  code: string
  summary: string
}

/** Resource Timing으로 실측한 모드별 prefetch 네트워크 비용 */
export interface ModeNetworkStats {
  /** 관찰된 `?_rsc=` 요청 수 */
  requests: number
  /** transferSize 합계(헤더 포함, 바이트) */
  transferBytes: number
  /** encodedBodySize 합계(본문만, 바이트) */
  bodyBytes: number
  /** 요청이 한 번이라도 발생한 상품(SKU) 수 */
  skus: number
}

/** 이 데모의 IntersectionObserver·onMouseEnter로 측정한 사용자 행동 */
export interface ModeActivity {
  /** 뷰포트(스크롤 박스 안 보이는 영역)에 한 번이라도 들어온 링크 수 */
  seen: number
  /** 마우스를 올린 링크 수 */
  hovered: number
}

/** 목적지 라우트에서 서버가 실제로 실행된 횟수 */
export interface RenderCounts {
  layout: number
  page: number
}

export type RenderSnapshot = Record<PrefetchMode, RenderCounts>
