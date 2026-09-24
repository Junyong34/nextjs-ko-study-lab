import type { RouteSpec } from './types'

export const BASE_PATH = '/zone/baseline/file-conventions/page/static-and-dynamic'

/**
 * 대조할 하위 page 4개. 네 page의 본문은 모두 같은 RenderStamp(렌더 시각 + 렌더 ID)를 그리며,
 * 차이는 "page 본문이 런타임 API를 호출하느냐" 하나뿐이다.
 * expectedSymbol은 공식 문서(building.md)의 빌드 표 기호로 적은 "기대값"이다 — 실측값은 응답 헤더와 렌더 ID로 확인한다.
 */
export const ROUTES: RouteSpec[] = [
  {
    key: 'static',
    segment: 'static',
    probeQuery: '',
    api: '런타임 API 없음',
    code: 'export default function Page() { return <RenderStamp /> }',
    expectedSymbol: '○',
  },
  {
    key: 'headers',
    segment: 'headers',
    probeQuery: '',
    api: 'await headers()',
    code: "const ua = (await headers()).get('user-agent')",
    expectedSymbol: 'ƒ',
  },
  {
    key: 'search-params',
    segment: 'search-params',
    probeQuery: '?probe=',
    api: 'await searchParams',
    code: 'const { q } = await props.searchParams',
    expectedSymbol: 'ƒ',
  },
  {
    key: 'connection',
    segment: 'connection',
    probeQuery: '',
    api: 'await connection()',
    code: "await connection() // from 'next/server'",
    expectedSymbol: 'ƒ',
  },
]

export const routeHref = (route: RouteSpec) => `${BASE_PATH}/${route.segment}`

/** 한 번의 실측에서 page마다 보낼 요청 수 */
export const SAMPLES_PER_ROUTE = 3
