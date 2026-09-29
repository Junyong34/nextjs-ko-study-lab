import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'directives/use-cache/function-cache')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { DirectiveUseCacheFunctionDemo } from './components/DirectiveUseCacheFunctionDemo'
import { getPopularProductRanking } from './cachedData'

export default async function DemoPage() {
  const initial = await getPopularProductRanking()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="'use cache' 함수 단위 기본 캐싱"
        concept="비동기 함수 맨 위에 'use cache'만 선언하면 cacheTag나 cacheLife 없이도 반환값이 캐시됩니다. 같은 함수를 다시 호출해도 본문이 재실행되지 않고, 캐시된 { cacheId, generatedAt }가 그대로 반환되는지를 관찰합니다."
        steps={[
          {
            step: 1,
            title: '초기 랭킹과 캐시 ID(#...) 확인',
            description: '페이지 진입 시 서버에서 getPopularProductRanking()이 1회 호출된 결과입니다.',
            actionBadge: '최초 호출',
          },
          {
            step: 2,
            title: '[함수 다시 호출하기] 클릭',
            description: '같은 함수를 다시 호출하는 Server Action을 실행합니다. 여러 번 눌러 봅니다.',
            actionBadge: '재호출',
          },
          {
            step: 3,
            title: '호출 이력 테이블과 검증 패널 확인',
            description: '여러 번 호출해도 cacheId·생성 시각이 바뀌지 않는지 대조합니다.',
            actionBadge: '동일성 확인',
            observe: '모든 호출의 cacheId가 동일하게 유지되어 검증 패널이 "검증 완료"로 전환됨',
            observeAt: 'verification',
          },
        ]}
      />
      <DirectiveUseCacheFunctionDemo initial={initial} />
    </DemoContainer>
  )
}
