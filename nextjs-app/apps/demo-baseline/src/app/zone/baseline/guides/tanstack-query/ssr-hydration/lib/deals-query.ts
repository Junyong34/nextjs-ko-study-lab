import { queryOptions } from '@tanstack/react-query'
import type { DealsSnapshot, DealsVariant } from '../types'

// 서버 prefetch와 브라우저 useQuery가 함께 쓰는 계약. queryKey가 정확히 같아야 서버 데이터가 이어진다.
// 기본 queryFn은 브라우저용(Route Handler 호출)이고, 서버 컴포넌트는 queryFn만 서버 함수로 바꿔 쓴다.
export const BASE = '/zone/baseline/guides/tanstack-query/ssr-hydration'
export const API_PATH = '/ssr-hydration/api/deals'
export const STALE_TIME = 60_000

export const dealsKey = (variant: DealsVariant) => ['guides-tanstack-ssr-hydration', 'deals', variant] as const

export function dealsQuery(variant: DealsVariant) {
  return queryOptions({
    queryKey: dealsKey(variant),
    queryFn: async (): Promise<DealsSnapshot> => {
      const res = await fetch(`${BASE}/api/deals?variant=${variant}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`GET ${res.status}`)
      return res.json()
    },
    // hydration 직후 바로 다시 요청하지 않도록 60초 동안 신선한 데이터로 본다.
    staleTime: STALE_TIME,
  })
}
