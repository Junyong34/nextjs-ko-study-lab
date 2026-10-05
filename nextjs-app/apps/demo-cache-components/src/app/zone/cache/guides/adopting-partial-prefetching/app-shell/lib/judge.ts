import { DISABLED_ID, FULL_ID, SHARED_IDS } from './constants'
import type { RscRequest } from '../types'

/** next/dist/client/components/segment-cache/cache.js 가 보내는 Next-Router-Prefetch 값 (16.3.2에서 확인) */
const HEADER_KIND: Record<string, string> = { '1': 'loading 경계', '2': 'PPR 런타임', '3': '런타임 셸(App Shell)' }
export const kindOf = (r: RscRequest) =>
  r.segmentPrefetch ? (r.segmentPrefetch === '/_tree' ? '라우트 트리' : '세그먼트') : (HEADER_KIND[r.prefetchHeader ?? ''] ?? '전체')

const idOf = (r: RscRequest) => r.path.split('/').pop() ?? ''
const inRoute = (r: RscRequest, route: 'partial' | 'legacy') => r.path.includes(`/app-shell/${route}/`)

export interface Check {
  label: string
  expected: string
  actual: string
  ok: boolean
}

export const IS_PROD = process.env.NODE_ENV === 'production'

/**
 * 판정은 반복 관찰(2회 새로고침)에서 안정적으로 같았던 항목만 쓴다.
 * - partial 기본 링크 3개 → 런타임 셸 요청(헤더 3) 정확히 1건 (링크끼리 공유)
 * - prefetch 링크(4) → 요청 1건 이상, prefetch={false} 링크(5) → 요청 0건
 * legacy 라우트의 URL별 세그먼트 요청 건수는 관찰 시점에 따라 1~3건으로 달라 판정에서 뺐다(표시만 한다).
 */
export function judge(requests: RscRequest[]): Check[] {
  const prefetches = requests.filter((r) => r.kind === 'prefetch')
  if (!IS_PROD) {
    return [{ label: 'development 모드', expected: 'prefetch 요청 0건 (dev는 prefetch를 하지 않는다)', actual: `${prefetches.length}건`, ok: prefetches.length === 0 }]
  }
  const shell = prefetches.filter((r) => inRoute(r, 'partial') && r.prefetchHeader === '3')
  const full = prefetches.filter((r) => inRoute(r, 'partial') && idOf(r) === FULL_ID && !r.segmentPrefetch)
  const disabled = prefetches.filter((r) => idOf(r) === DISABLED_ID)
  return [
    {
      label: `partial 기본 링크 ${SHARED_IDS.length}개의 런타임 셸 요청`,
      expected: '1건 (같은 라우트를 가리키는 링크가 App Shell 하나를 공유)',
      actual: `${shell.length}건`,
      ok: shell.length === 1,
    },
    { label: '<Link prefetch> (상품 4)', expected: '요청 1건 이상', actual: `${full.length}건`, ok: full.length >= 1 },
    { label: 'prefetch={false} (상품 5)', expected: '요청 0건', actual: `${disabled.length}건`, ok: disabled.length === 0 },
  ]
}
