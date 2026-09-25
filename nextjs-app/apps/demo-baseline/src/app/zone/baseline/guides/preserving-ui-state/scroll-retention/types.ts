/** 이 데모의 내부 경로. zone 안의 실제 라우트다. */
export const DEMO_BASE = '/zone/baseline/guides/preserving-ui-state/scroll-retention'
/** 실제로 스크롤되는 카탈로그 문서(iframe 안)의 라우트: catalog?cat=… */
export const CATALOG_PATH = `${DEMO_BASE}/catalog`

export const CATEGORIES = [
  { id: 'outer', label: '아우터' },
  { id: 'knit', label: '니트' },
  { id: 'pants', label: '팬츠' },
  { id: 'shoes', label: '슈즈' },
] as const
export type CategoryId = (typeof CATEGORIES)[number]['id']
export const DEFAULT_CATEGORY: CategoryId = 'outer'

/** iframe → 부모 페이지 postMessage 타입. 같은 오리진에서만 주고받는다. */
export const MSG_FRAME_READY = 'SCROLL_RETENTION_FRAME_READY'
export const MSG_NAV_RECORD = 'SCROLL_RETENTION_NAV_RECORD'

/** 필터(?cat=)를 바꾸는 방법 5종. pathname은 그대로이고 searchParams만 바뀐다. */
export type NavMethod = 'link-default' | 'link-false' | 'push-default' | 'push-false' | 'replace-false'

export interface NavMethodConfig {
  method: NavMethod
  label: string
  /** 실제로 실행되는 코드 (화면 표시용) */
  code: string
  /** scroll 옵션을 끈 방법인가 */
  scrollFalse: boolean
}

export const NAV_METHODS: NavMethodConfig[] = [
  { method: 'link-default', label: 'Link · 기본', code: '<Link href="?cat=…">', scrollFalse: false },
  { method: 'link-false', label: 'Link · scroll={false}', code: '<Link href="?cat=…" scroll={false}>', scrollFalse: true },
  { method: 'push-default', label: 'push · 기본', code: 'router.push(url)', scrollFalse: false },
  { method: 'push-false', label: 'push · scroll: false', code: 'router.push(url, { scroll: false })', scrollFalse: true },
  {
    method: 'replace-false',
    label: 'replace · scroll: false',
    code: 'router.replace(url, { scroll: false })',
    scrollFalse: true,
  },
]

/** 필터 변경 1회에 대한 실측 기록. 모든 수치는 iframe 문서에서 직접 읽은 값이다. */
export interface NavRecord {
  /** iframe 레이아웃의 React state 카운터 (하드 리로드가 있으면 1부터 다시 시작) */
  seq: number
  method: NavMethod
  /** 클릭 직전 / 목적지의 location.search (예: "?cat=outer") */
  fromSearch: string
  toSearch: string
  /** Server Component page가 실제로 받아 data 속성에 렌더링한 searchParams (이동 완료 후) */
  receivedSearch: string
  /** 서버 렌더마다 새로 만드는 ID (클릭 직전 / 이동 완료 후) */
  renderIdBefore: string
  renderIdAfter: string
  /** window.scrollY (문서 스크롤) */
  beforeY: number
  afterY: number
  /** document.documentElement.clientHeight — Next.js가 뷰포트 판정에 쓰는 값 */
  viewportH: number
  /** Page 루트 엘리먼트의 getBoundingClientRect().top (클릭 직전 / 이동 후) */
  pageTopBefore: number
  pageTopAfter: number
  /** 목록 패널 A(key 없음)의 scrollTop */
  keptBefore: number
  keptAfter: number
  /** 목록 패널 B(key={cat})의 scrollTop */
  keyedBefore: number
  keyedAfter: number
  /** 패널 B의 DOM 노드가 이동 전후로 다른 객체인가 (key 변경으로 교체됐는가) */
  keyedReplaced: boolean
  /** 패널 A의 DOM 노드가 이동 전후로 다른 객체인가 */
  keptReplaced: boolean
  /** iframe 문서의 performance.timeOrigin — 문서가 다시 로드되면 바뀐다 */
  timeOrigin: number
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
