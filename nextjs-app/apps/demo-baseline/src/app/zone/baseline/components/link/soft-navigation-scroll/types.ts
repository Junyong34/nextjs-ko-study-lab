/** 이 데모의 내부 경로. zone 안의 실제 라우트다. */
export const DEMO_BASE = '/zone/baseline/components/link/soft-navigation-scroll'
/** 실제로 스크롤되는 문서(iframe 안)의 라우트: viewport/[chapter] */
export const VIEWPORT_BASE = `${DEMO_BASE}/viewport`
export const CHAPTERS = ['1', '2', '3'] as const

/** iframe → 부모 페이지 postMessage 타입. 같은 오리진에서만 주고받는다. */
export const MSG_FRAME_READY = 'LINK_SCROLL_FRAME_READY'
export const MSG_NAV_RECORD = 'LINK_SCROLL_NAV_RECORD'

/**
 * 실습에서 누를 수 있는 <Link> 4종.
 * - page-*: 다른 Page 세그먼트(viewport/1 → viewport/2)로 이동
 * - hash-*: 같은 Page 안의 #id로 이동 (onlyHashChange)
 */
export type NavKind = 'page-default' | 'page-false' | 'hash-default' | 'hash-false'

export interface NavKindConfig {
  kind: NavKind
  label: string
  /** <Link scroll> prop에 그대로 전달되는 값. undefined = 미지정(기본값 true) */
  scrollProp: false | undefined
  /** hash-* 전용: 이동할 섹션 id */
  hashId?: string
}

export const NAV_KINDS: NavKindConfig[] = [
  { kind: 'page-default', label: '다음 장 · 기본', scrollProp: undefined },
  { kind: 'page-false', label: '다음 장 · scroll={false}', scrollProp: false },
  { kind: 'hash-default', label: '#s-5 결론 · 기본', scrollProp: undefined, hashId: 's-5' },
  { kind: 'hash-false', label: '#s-3 · scroll={false}', scrollProp: false, hashId: 's-3' },
]

/** 사용자 클릭 1회에 대한 실측 기록. 모든 수치는 iframe 문서에서 직접 읽은 값이다. */
export interface NavRecord {
  /** iframe 레이아웃의 React state 카운터 (하드 리로드가 있으면 1부터 다시 시작) */
  seq: number
  kind: NavKind
  fromUrl: string
  toUrl: string
  /** 클릭 직전 / 이동 완료 후 window.scrollY */
  beforeY: number
  afterY: number
  /** document.documentElement.clientHeight — Next.js가 뷰포트 판정에 쓰는 값 */
  viewportH: number
  /** Page 루트 엘리먼트의 getBoundingClientRect().top (클릭 직전 / 이동 후) */
  pageTopBefore: number
  pageTopAfter: number
  /** hash-* 전용: 대상 섹션의 rect.top (클릭 직전 / 이동 후)과 scroll-margin-top */
  targetTopBefore: number | null
  targetTopAfter: number | null
  scrollMarginTop: number | null
  /** 이동 후 rect.top이 자기 scroll-margin-top과 같은(= scrollIntoView로 정렬된) 섹션 id */
  landedOn: string | null
  /** 클릭 전후로 URL 해시가 실제로 바뀌었는가 */
  hashChanged: boolean
  /** iframe 문서의 performance.timeOrigin — 문서가 다시 로드되면 바뀐다 */
  timeOrigin: number
  /** 이동이 끝나기까지 걸린 시간(ms). 15초 안에 끝나지 않으면 timedOut */
  elapsedMs: number
  timedOut: boolean
}

export interface FrameReadyMessage {
  type: typeof MSG_FRAME_READY
  timeOrigin: number
  href: string
}

export interface NavRecordMessage {
  type: typeof MSG_NAV_RECORD
  record: NavRecord
}
