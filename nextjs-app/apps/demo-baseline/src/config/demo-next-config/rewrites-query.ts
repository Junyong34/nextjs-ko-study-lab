import type { DemoConfigPart } from './types'

// 이 모듈은 단일 데모(config/rewrites/query-param-rewrite)가 소유한다.
// source/destination은 반드시 이 데모 경로 하위로 한정한다.
const BASE = '/zone/baseline/config/rewrites/query-param-rewrite'

// 배열로 반환한 rewrites는 afterFiles 단계다 — 파일 시스템(실제 page)이 먼저 일치하면 그쪽이 우선하고,
// 일치하는 page가 없을 때만 아래 규칙을 순서대로 평가한다. 그래서 source 경로(old, legacy)에는 page 파일을 두지 않는다.
export const demoConfig: DemoConfigPart = {
  rewrites: [
    // 1) 쿼리 → 경로: has(query)의 named capture group (?<id>\d+)가 destination의 :id로 쓰인다.
    //    /old?id=123 → /products/123?source=rewrite  (id가 숫자가 아니면 has가 맞지 않아 규칙이 적용되지 않는다)
    {
      source: `${BASE}/old`,
      has: [{ type: 'query', key: 'id', value: '(?<id>\\d+)' }],
      destination: `${BASE}/products/:id?source=rewrite`,
    },
    // 2) 경로 → 쿼리: destination에 쓰이지 않은 캡처 파라미터는 쿼리로 넘어가지만,
    //    여기서는 쿼리를 명시해 어떤 값이 어떤 키로 가는지 드러낸다.
    //    /legacy/shoes/7 → /lookup?category=shoes&sku=7&source=rewrite
    {
      source: `${BASE}/legacy/:category/:sku`,
      destination: `${BASE}/lookup?category=:category&sku=:sku&source=rewrite`,
    },
  ],
}
