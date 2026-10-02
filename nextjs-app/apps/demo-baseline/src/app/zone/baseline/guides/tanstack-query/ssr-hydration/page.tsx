import type { Metadata } from 'next'
import { connection } from 'next/server'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getDemoMetadata } from '@study/demos'
import { HydrationLab } from './components/HydrationLab'
import { getDeals } from './lib/deals'
import { dealsQuery } from './lib/deals-query'
import type { ServerRenderInfo } from './types'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/tanstack-query/ssr-hydration')

export default async function DemoPage() {
  // 요청이 들어온 뒤 렌더한다. 빌드 때 한 번 prefetch한 결과를 모두에게 재사용하지 않게 한다.
  await connection()
  const renderedAt = Date.now()

  // 요청마다 새 QueryClient — 다른 요청(사용자)의 캐시가 섞이지 않는다.
  const queryClient = new QueryClient()
  const cacheSizeAtCreate = queryClient.getQueryCache().getAll().length

  await queryClient.prefetchQuery({
    ...dealsQuery('prefetched'),
    queryFn: () => getDeals('server-prefetch', 'prefetched'),
  })

  const info: ServerRenderInfo = {
    variant: 'prefetched',
    renderId: crypto.randomUUID(),
    renderedAt,
    cacheSizeAtCreate,
    prefetchedReadNo: queryClient.getQueryData(dealsQuery('prefetched').queryKey)?.readNo ?? null,
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HydrationLab info={info} />
    </HydrationBoundary>
  )
}
