import type { Scenario } from './types'

// 기대값의 출처는 src/config/demo-next-config/rewrites-query.ts의 규칙 두 개다.
//  - /old + has(query id=(?<id>\d+))  → /products/:id?source=rewrite
//  - /legacy/:category/:sku           → /lookup?category=:category&sku=:sku&source=rewrite
// 목적지가 받는 searchParams에는 destination에 적은 쿼리뿐 아니라 요청의 원래 쿼리도 함께 남는다(next@16.3.2 실측).
export const SCENARIOS: Scenario[] = [
  {
    id: 'query-to-path',
    label: '쿼리 → 경로',
    buildPath: (v) => `/old?id=${v}`,
    rewritten: true,
    expectStatus: 200,
    expectDestination: 'products/[id]',
    expectParams: (v) => ({ id: v }),
    expectSearch: (v) => ({ id: v, source: 'rewrite' }),
    note: 'has(query)가 맞아 /products/:id로 매핑되고 source=rewrite가 붙는다.',
  },
  {
    id: 'path-to-query',
    label: '경로 → 쿼리',
    buildPath: (v) => `/legacy/shoes/${v}`,
    rewritten: true,
    expectStatus: 200,
    expectDestination: 'lookup',
    expectParams: () => ({}),
    expectSearch: (v) => ({ category: 'shoes', sku: v, source: 'rewrite' }),
    note: '경로 세그먼트(:category, :sku)가 /lookup의 쿼리 값이 된다.',
  },
  {
    id: 'value-mismatch',
    label: 'has 값 불일치',
    buildPath: () => '/old?id=abc',
    rewritten: false,
    expectStatus: 404,
    expectDestination: null,
    expectParams: () => ({}),
    expectSearch: () => ({}),
    note: 'id가 숫자가 아니라 has가 맞지 않는다. /old에는 page 파일이 없어 404가 된다.',
  },
  {
    id: 'no-query',
    label: '쿼리 없음',
    buildPath: () => '/old',
    rewritten: false,
    expectStatus: 404,
    expectDestination: null,
    expectParams: () => ({}),
    expectSearch: () => ({}),
    note: 'has(query id)가 요구하는 쿼리가 없어 규칙이 적용되지 않는다.',
  },
  {
    id: 'direct',
    label: '목적지 직접 접근',
    buildPath: (v) => `/products/${v}`,
    rewritten: false,
    expectStatus: 200,
    expectDestination: 'products/[id]',
    expectParams: (v) => ({ id: v }),
    expectSearch: () => ({}),
    note: 'rewrite를 거치지 않으면 source=rewrite가 없다. 목적지는 평범한 동적 페이지다.',
  },
]

export const scenarioById = (id: Scenario['id']) => SCENARIOS.find((s) => s.id === id)!
