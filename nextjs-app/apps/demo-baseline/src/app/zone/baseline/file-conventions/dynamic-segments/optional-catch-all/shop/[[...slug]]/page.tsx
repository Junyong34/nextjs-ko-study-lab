import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/dynamic-segments/optional-catch-all/shop/[[...slug]]')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import type { ParamsObservation } from '../../types'
import { ShopRouteNav } from '../../components/ShopRouteNav'
import { ParamsObservationTable } from '../../components/ParamsObservationTable'
import { SlugVerificationPanel } from '../../components/SlugVerificationPanel'
import { OptionalCatchAllDeepDive } from '../../components/OptionalCatchAllDeepDive'

export default async function OptionalCatchAllShopPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  // 가공 없이 서버가 받은 값 그대로를 측정한다.
  const resolved = await params
  const { slug } = resolved
  const observation: ParamsObservation = {
    paramsJson: JSON.stringify(resolved),
    keys: Object.keys(resolved),
    hasSlugKey: 'slug' in resolved,
    typeofSlug: typeof slug,
    isArray: Array.isArray(slug),
    length: Array.isArray(slug) ? slug.length : null,
    slugJson: String(JSON.stringify(slug)),
    items: Array.isArray(slug) ? [...slug] : [],
  }

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="shop/[[...slug]]/page.tsx 렌더링 결과"
        concept="이 화면은 세그먼트 개수와 관계없이 shop/[[...slug]]/page.tsx 한 파일이 렌더링합니다. 아래 표는 이 요청에서 await params가 돌려준 값입니다."
        steps={[
          {
            step: 1,
            title: '실측 표 읽기',
            description: 'typeof slug, Array.isArray(slug), slug?.length 행으로 이번 요청의 params.slug 형태를 확인합니다.',
            actionBadge: '실측',
          },
          {
            step: 2,
            title: '다른 세그먼트 개수로 이동',
            description: '링크를 눌러 0개·1개·3개·인코딩 경로를 오가며 같은 파일이 어떤 값을 받는지 비교합니다.',
            actionBadge: '비교',
            observe: '검증 패널에서 주소 기준 기대값과 await params 실제값이 일치하는지 확인',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="서버가 받은 params (shop/[[...slug]]/page.tsx)">
        <div className="space-y-4">
          <ParamsObservationTable observation={observation} />
          <ShopRouteNav />
        </div>
      </DemoPlaygroundCard>

      <SlugVerificationPanel observation={observation} />
      <OptionalCatchAllDeepDive />
    </DemoContainer>
  )
}
