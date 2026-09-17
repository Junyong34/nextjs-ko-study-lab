import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/fetch-extended/tag-option')

import React from 'react'
import { headers } from 'next/headers'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PRODUCT_TAGS } from './types'
import type { ProductKey, TaggedProductSnapshot } from './types'
import { FetchExtendedTagDemo } from './components/FetchExtendedTagDemo'

const API_BASE_PATH = '/zone/baseline/functions/fetch-extended/tag-option/api'

async function fetchTaggedProduct(baseUrl: string, product: ProductKey): Promise<TaggedProductSnapshot> {
  const response = await fetch(`${baseUrl}${API_BASE_PATH}/${product}`, {
    cache: 'force-cache',
    next: { tags: [PRODUCT_TAGS[product]] },
  })
  return response.json()
}

export default async function DemoPage() {
  const headerList = await headers()
  const host = headerList.get('host')
  const protocol = headerList.get('x-forwarded-proto') ?? 'http'
  const baseUrl = `${protocol}://${host}`

  const [shoes, windbreaker] = await Promise.all([
    fetchTaggedProduct(baseUrl, 'shoes'),
    fetchTaggedProduct(baseUrl, 'windbreaker'),
  ])

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Next.js 확장 fetch tags 태그 바인딩"
        concept="fetch(url, { cache: 'force-cache', next: { tags: ['shoes'] } })로 캐시된 응답에는 실제 캐시 태그가 붙습니다. revalidateTag('shoes', ...)를 호출하면 그 태그가 붙은 fetch 캐시만 무효화되어 다음 조회에서 실제로 다시 조회되고, 다른 태그의 fetch는 그대로 캐시된 값을 유지합니다."
        steps={[
          {
            step: 1,
            title: '[러닝화 캐시 태그 무효화] 클릭',
            description: "actions.ts의 purgeShoesTagAction()이 revalidateTag('fetch-extended-tag-option-shoes', { expire: 0 })를 실제로 호출합니다.",
            actionBadge: 'Server Action',
          },
          {
            step: 2,
            title: 'router.refresh()로 서버 컴포넌트를 다시 렌더링',
            description: '무효화 직후 클라이언트가 router.refresh()를 호출해 이 페이지의 두 fetch(러닝화/윈드브레이커)를 모두 다시 실행시킵니다.',
            actionBadge: 'router.refresh()',
          },
          {
            step: 3,
            title: '러닝화의 fetchedAt·fetchCount만 갱신되고 윈드브레이커는 그대로인지 확인',
            description: '태그를 무효화한 상품만 실제로 캐시 미스가 발생해 값이 바뀌고, 무효화하지 않은 상품은 캐시 HIT으로 이전 값을 그대로 유지해야 합니다.',
            actionBadge: '캐시 대조',
            observe: '무효화한 태그의 상품만 fetchedAt/fetchCount가 갱신되고, 다른 상품은 값이 그대로인지',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="Next.js 확장 fetch tags 태그 바인딩 실습">
        <FetchExtendedTagDemo shoes={shoes} windbreaker={windbreaker} />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
