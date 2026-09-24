import type { RouteSpec } from './types'

export const BASE_PATH = '/zone/baseline/guides/caching-legacy/segment-revalidate'

/** 자동 관측: 이 간격으로 isr-10s/를 실제 요청한다. revalidate(10초)를 두 번 넘길 만큼 반복한다. */
export const AUTO_INTERVAL_MS = 2000
export const AUTO_REQUESTS = 14

export const ROUTES: RouteSpec[] = [
  { key: 'isr-10s', segment: 'isr-10s', config: 'export const revalidate = 10' },
  { key: 'static', segment: 'static', config: 'revalidate 미지정 (기본값 false)' },
]

export const routeHref = (key: RouteSpec['key']) => `${BASE_PATH}/${key}`
