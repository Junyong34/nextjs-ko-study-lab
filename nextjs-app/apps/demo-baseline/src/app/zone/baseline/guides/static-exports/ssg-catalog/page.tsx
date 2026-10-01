import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/static-exports/ssg-catalog')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { SsgCatalogLab } from './components/SsgCatalogLab'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="generateStaticParams로 정적 카탈로그 사전 생성"
        concept="generateStaticParams가 반환한 id만 빌드 때 HTML로 만들고, dynamicParams = false이면 목록 밖 id는 요청 시점에 만들지 않고 404로 응답한다. 실제 products/[id] 라우트를 fetch해 응답 상태와 렌더 시각을 측정한다. next dev는 요청마다 다시 렌더하므로 '빌드 시점 고정'은 production 빌드에서만 관찰된다."
        steps={[
          {
            step: 1,
            title: '[상품 id]에서 사전 생성 목록의 id(001)를 선택',
            description: '목록 안(001~004)과 밖(005, 999) 중 하나를 고릅니다. 005는 카탈로그 데이터가 있지만 generateStaticParams에는 없습니다.',
            actionBadge: 'id 선택',
          },
          {
            step: 2,
            title: '[같은 URL을 두 번 요청해 측정] 실행',
            description: '약 1.2초 간격으로 같은 URL을 두 번 fetch해 상태 코드, cache-control, x-nextjs-cache, HTML에 심긴 렌더 시각을 읽습니다.',
            actionBadge: '측정',
            observe: '요청 #1·#2의 상태와 렌더 시각이 같은지 다른지',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '목록 밖 id(005 또는 999)도 측정',
            description: 'dynamicParams = false이면 두 id 모두 404여야 합니다. 두 id를 비교해 데이터 유무와 무관함을 확인합니다.',
            actionBadge: '404 확인',
            observe: '상태 404, 렌더 시각 없음',
            observeAt: 'playground',
          },
          {
            step: 4,
            title: '검증 패널의 실행 모드 확인',
            description: '응답이 알려 주는 NODE_ENV에 맞는 기대값으로 판정합니다. dev 서버에서는 "고정" 동작이 미검증으로 표시됩니다.',
            actionBadge: '결과 확인',
            observe: '통과/실패 항목과 미검증 안내',
            observeAt: 'verification',
          },
        ]}
      />
      <SsgCatalogLab />
    </DemoContainer>
  )
}
