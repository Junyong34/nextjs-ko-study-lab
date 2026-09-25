export const RCB_BASE_PATH = '/zone/baseline/guides/instant-navigation/router-cache-back'

/** 두 하위 page가 요청마다 서버에서 실제로 await하는 시간(ms). 느린 데이터 조회를 대신하는 관측용 지연이다. */
export const SERVER_DELAY_MS = 300

/** 측정 대상인 동적 하위 page. 폴더 이름과 같다. */
export type RouteKey = 'catalog' | 'product'

export const ROUTES: readonly RouteKey[] = ['catalog', 'product']

export const ROUTE_LABEL: Record<RouteKey, string> = {
  catalog: '상품 목록',
  product: '상품 상세',
}

export function routeHref(route: RouteKey) {
  return `${RCB_BASE_PATH}/${route}`
}

export function routeFromPath(pathname: string): RouteKey | null {
  return ROUTES.find((r) => pathname === routeHref(r)) ?? null
}

/**
 * 이동 방식.
 * - link: <Link>로 새 히스토리 항목 push
 * - back / forward: router.back() / router.forward() → popstate
 * - browser: 브라우저 자체 뒤로/앞으로 버튼(또는 단축키) → popstate
 * - refresh: router.refresh()
 * - document: 문서 최초 로드(HTML). 비교 판정에서 제외한다.
 */
export type NavKind = 'link' | 'back' | 'forward' | 'browser' | 'refresh' | 'document'

export type NavGroup = 'history' | 'link' | 'refresh'

export const KIND_LABEL: Record<NavKind, string> = {
  link: '<Link> 새 진입',
  back: 'router.back()',
  forward: 'router.forward()',
  browser: '브라우저 뒤로/앞으로',
  refresh: 'router.refresh()',
  document: '문서 최초 로드',
}

export function groupOf(kind: NavKind): NavGroup | null {
  if (kind === 'back' || kind === 'forward' || kind === 'browser') return 'history'
  if (kind === 'link') return 'link'
  if (kind === 'refresh') return 'refresh'
  return null
}

/** 서버 page가 렌더링할 때 만든 값. 클라이언트 RenderReporter가 화면 커밋 시점에 보고한다. */
export interface ServerRender {
  route: RouteKey
  renderId: string
  renderedAt: string
}

/** 이동 1회의 실측 기록. 시각은 performance.now() 기준(ms). */
export interface NavRecord {
  seq: number
  kind: NavKind
  route: RouteKey
  renderId: string
  renderedAt: string
  /** 이 렌더 ID가 이번 이동 전에 이미 화면에 나타난 적이 있는가 (= 서버 재렌더 없이 복원) */
  reused: boolean
  /** 뒤로/앞으로 이동인데, 이 경로가 마지막으로 화면에 있던 뒤에 router.refresh()가 실행된 경우 */
  afterRefresh: boolean
  /** 이동 시작~화면 커밋 사이에 도착 경로로 나간 fetch 수 (Resource Timing API) */
  rscCount: number | null
  rscPaths: string[]
  /** 같은 구간에 이 데모의 다른 하위 경로로 나간 fetch 수 (production의 링크 재-prefetch 등, 판정 제외) */
  otherFetches: number
  durationMs: number | null
  mode: 'development' | 'production'
}

export interface RouterCacheVerdict {
  isMatched: boolean | undefined
  reasons: string[]
}
