export type CaseId = 'static-blur' | 'remote-blur' | 'remote-empty'

/** 렌더된 <img>의 inline style.backgroundImage를 해석한 결과. */
export interface BackgroundInfo {
  /** style.backgroundImage 문자열 전체 길이(없으면 0) */
  cssLength: number
  /** Next.js가 blurDataURL을 감싸는 SVG 블러 필터(data:image/svg+xml) 사용 여부 */
  svgWrapped: boolean
  /** SVG 안 <image href> 또는 url(...)에 들어간 실제 blurDataURL(없으면 null) */
  innerHref: string | null
}

/** 한 카드의 실측 결과. 모든 값은 DOM/performance API에서 읽는다. */
export interface ProbeResult {
  /** 마운트 직후(첫 페인트 전) 읽은 background 정보. null이면 아직 측정 전 */
  initial: BackgroundInfo | null
  /** 마운트 → onLoad 콜백까지 경과 ms */
  loadMs: number | null
  /** 마운트 → style에서 background-image가 사라진 MutationObserver 시점 ms */
  bgRemovedMs: number | null
  /** onLoad 다음 프레임에 다시 읽은 background-image 존재 여부 */
  bgAfterLoad: boolean | null
  /** 지금 이 순간 background-image가 붙어 있는지(실시간) */
  bgNow: boolean
  /** 브라우저 Resource Timing의 responseStart - requestStart(서버 대기 시간) ms */
  serverWaitMs: number | null
}

export interface CaseExpectation {
  bgInitially: boolean
  /** 기대하는 blurDataURL 출처 설명 */
  source: string
  /** 비교 대상 blurDataURL(없으면 null — placeholder="empty") */
  expectedHref: string | null
}
