import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/fetch-extended/revalidate-option')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { FetchExtendedRevalidateDemo } from './components/FetchExtendedRevalidateDemo'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Next.js 확장 fetch revalidate 옵션"
        concept="Next.js 확장 fetch API의 { next: { revalidate: N } } 옵션은 데이터 캐시의 수명을 초 단위로 지정합니다. N초 이내 반복 호출은 캐시된 값을 그대로 반환하고, N초가 지난 뒤의 호출만 실제로 origin을 다시 호출합니다."
        steps={[
          {
            step: 1,
            title: '[러닝화 (#001)] 또는 [윈드브레이커 (#002)]와 revalidate(5초/10초) 선택',
            description: '어떤 상품을, 몇 초짜리 캐시 수명으로 조회할지 정합니다.',
            actionBadge: '조건 선택',
          },
          {
            step: 2,
            title: '[자동 폴링 시작] 클릭',
            description: '1초 간격으로 fetch(next.revalidate) 실습 콘솔이 내부 /api Route Handler를 반복 호출합니다.',
            actionBadge: '폴링 시작',
          },
          {
            step: 3,
            title: 'originCallCount 변화로 HIT/MISS 전환 관찰',
            description:
              'revalidate 초 이내에는 origin이 실행되지 않아 originCallCount가 그대로(HIT)이고, 초가 지난 첫 호출에서만 origin이 실행되어 값이 증가(MISS)하는지 검증 패널에서 확인합니다.',
            actionBadge: '로그 검증',
            observe: 'HIT 유지 구간과 MISS 전환 시점이 revalidate 값과 일치하는지 실측',
            observeAt: 'verification',
          },
        ]}
      />
      <FetchExtendedRevalidateDemo />
    </DemoContainer>
  )
}
