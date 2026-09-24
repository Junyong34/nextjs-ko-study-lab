import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/interactive-apps/multi-filter-widget')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { createRenderStamp, listCategories, queryProducts, SERVER_LATENCY_MS } from './data'
import { normalizeSearch, parseFilters, toURLSearchParams } from './lib/filters'
import type { ServerSnapshot } from './types'
import { ShopDemo } from './components/ShopDemo'

type SearchParams = Record<string, string | string[] | undefined>

/**
 * Server Component page.
 * - 필터/정렬 상태의 원본은 URL(searchParams)이다. page는 그것을 받아 서버에서 필터링·정렬한다.
 * - 장바구니처럼 공유·복원이 필요 없는 상태만 Client Component(ShopDemo)가 useState로 가진다.
 */
export default async function MultiFilterWidgetPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const received = toURLSearchParams(await searchParams)
  const filters = parseFilters(received)
  const { products, total } = await queryProducts(filters)

  const snapshot: ServerSnapshot = {
    ...createRenderStamp(),
    receivedSearch: normalizeSearch(received),
    filters,
    total,
    count: products.length,
    latencyMs: SERVER_LATENCY_MS,
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="필터는 URL, 목록은 서버, 장바구니는 클라이언트 — 상태를 어디에 두는가"
        concept="필터·정렬은 URL searchParams에 두고 Server Component page가 그 값으로 목록을 렌더링합니다. 칩은 useOptimistic과 transition으로 즉시 반응하고, 장바구니만 Client Component 상태로 둡니다. 각 상태가 필터 이동·뒤로가기·새로고침에서 어떻게 달라지는지 실측합니다."
        steps={[
          {
            step: 1,
            title: '상품 카드의 [담기]를 1~2번 클릭',
            description: '장바구니는 ShopDemo(Client Component)의 useState에만 있습니다. URL과 서버는 이 값을 모릅니다.',
            actionBadge: '클라이언트 상태',
          },
          {
            step: 2,
            title: '[카테고리] / [정렬] / [재고] 칩 클릭',
            description:
              '칩은 현재 프레임에 바로 선택되고, router.push로 URL이 바뀌면 서버가 새 searchParams로 다시 렌더링합니다. 기다리는 동안 목록이 흐려집니다.',
            actionBadge: 'URL 상태',
            observe: '주소 표시줄·서버 렌더 ID·결과 개수가 바뀌고, 장바구니 수량과 인스턴스 ID는 그대로',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[뒤로가기 history.back()] 클릭',
            description: '이전 URL로 돌아가면 필터 UI와 목록이 그 URL 기준으로 복원됩니다. 장바구니는 history에 없으므로 되돌아가지 않습니다.',
            actionBadge: '뒤로가기',
            observe: '관측 로그의 popstate 행: 이전 쿼리로 복원, 서버 렌더 ID 재사용 여부',
            observeAt: 'playground',
          },
          {
            step: 4,
            title: '필터가 걸린 상태에서 장바구니를 채우고 [새로고침] 클릭',
            description: '문서를 다시 불러오면 URL에 있던 필터는 서버가 그대로 다시 적용하고, 메모리에만 있던 장바구니는 비어서 시작합니다.',
            actionBadge: '새로고침',
            observe: '새로고침 전/후 쿼리와 장바구니 수량 비교',
            observeAt: 'verification',
          },
        ]}
      />
      <ShopDemo snapshot={snapshot} products={products} categories={listCategories()} />
    </DemoContainer>
  )
}
