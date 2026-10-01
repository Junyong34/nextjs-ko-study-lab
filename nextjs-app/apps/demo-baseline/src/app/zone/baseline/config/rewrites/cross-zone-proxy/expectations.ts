import type { Scenario, ScenarioId } from './types'

// 기대값은 src/config/demo-next-config/rewrites-cross-zone.ts의 두 규칙에서 도출한다.
//   /via-cache/:path* → {ZONE_CACHE_URL}/zone/cache/:path*
//   /api/og           → {ZONE_CACHE_URL}/zone/cache/og (쿼리는 그대로 전달)
export const SCENARIOS: Scenario[] = [
  {
    id: 'zone-page',
    label: 'Zone 페이지 프록시',
    buildPath: () => '/via-cache/caching/basic',
    proxied: true,
    kind: 'html',
    expectStatus: 200,
    expectZone: 'cache',
    note: 'cache zone의 caching/basic 페이지 HTML',
  },
  {
    id: 'api-og',
    label: 'Route Handler 프록시',
    buildPath: (title) => `/api/og?title=${encodeURIComponent(title)}`,
    proxied: true,
    kind: 'image',
    expectStatus: 200,
    expectZone: 'cache',
    note: 'cache zone의 /zone/cache/og Route Handler(PNG)',
  },
  {
    id: 'upstream-404',
    label: '업스트림 404 전달',
    buildPath: () => '/via-cache/no-such-demo',
    proxied: true,
    kind: 'html',
    expectStatus: 404,
    expectZone: 'cache',
    note: 'cache zone에 없는 경로 — cache zone의 not-found가 그대로 전달',
  },
  {
    id: 'control',
    label: '대조군(규칙 밖)',
    buildPath: () => '/unmatched/caching/basic',
    proxied: false,
    kind: 'html',
    expectStatus: 404,
    expectZone: 'baseline',
    note: 'via-cache 접두사가 없어 규칙 미적용 — baseline이 404',
  },
]

export const scenarioById = (id: ScenarioId) => SCENARIOS.find((s) => s.id === id)!
