/** zone 내부 경로 — 셸 iframe 안에서도 같은 값을 쓴다 */
export const DEMO_PATH = '/zone/cache/config/stale-times/router-cache-tuning'

export const ROUTES = ['static', 'dynamic'] as const
export type RouteKey = (typeof ROUTES)[number]

export const ROUTE_LABEL: Record<RouteKey, string> = {
  static: '정적 page',
  dynamic: '동적 page',
}

export function routeHref(route: RouteKey) {
  return `${DEMO_PATH}/${route}`
}

export function routeFromPath(pathname: string): RouteKey | null {
  return ROUTES.find((route) => pathname === routeHref(route) || pathname === `${routeHref(route)}/`) ?? null
}

/** next.config에 experimental.staleTimes를 두지 않았을 때 16.3.2의 기본값(초) */
export const DEFAULT_STALE_TIMES = { dynamic: 0, static: 300 } as const

/** window.fetch 계측으로 본 RSC 요청 하나 */
export interface RscFetch {
  route: RouteKey | null
  path: string
  /** next-router-prefetch 헤더가 붙은 prefetch 요청인지 */
  prefetch: boolean
  startedAt: number
  status: number | null
  /** 응답의 x-nextjs-stale-time 헤더(초) */
  staleTime: string | null
}

export interface NavRecord {
  seq: number
  route: RouteKey
  durationMs: number
  /** 이동 중 도착 경로로 나간 일반 RSC 요청 수(prefetch 제외) */
  navRequests: number
  prefetchRequests: number
  renderId: string
  prevRenderId: string | null
  /** 이 경로의 직전 RSC 응답 이후 경과 시간(초). 이전 응답이 없으면 null */
  ageSec: number | null
  /** 직전 응답의 x-nextjs-stale-time(초). 없으면 null */
  staleTimeSec: number | null
  mode: 'development' | 'production'
}

export interface Verdict {
  isMatched: boolean | undefined
  reasons: string[]
}
