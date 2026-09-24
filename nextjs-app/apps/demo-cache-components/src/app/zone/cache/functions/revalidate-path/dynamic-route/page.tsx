import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/revalidate-path/dynamic-route')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { RevalidateLab } from './components/RevalidateLab'
import { ConceptDeepDive } from './components/ConceptDeepDive'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="다이나믹 라우트 세그먼트의 revalidatePath 동작"
        concept="revalidatePath('/products/1')처럼 구체 경로를 넘기면 그 경로 하나만, revalidatePath('/products/[id]', 'page')처럼 라우트 패턴과 type을 넘기면 그 page 파일로 렌더되는 모든 경로의 캐시가 무효화됩니다."
        steps={[
          {
            step: 1,
            title: '상품 1·2·3의 초기 cacheId 확인',
            description: "세 iframe은 실제 products/[id] 경로입니다. cacheId는 'use cache' 안에서 생성된 값이고, '대조군' 버튼으로 다시 요청해도 그대로인지 먼저 확인합니다.",
            actionBadge: '초기 상태',
          },
          {
            step: 2,
            title: "'구체 경로'와 '패턴 + page'를 번갈아 실행",
            description: 'Server Action이 revalidatePath를 호출한 뒤 세 iframe을 새로 요청합니다. 표에서 어떤 id의 cacheId가 바뀌었는지 비교합니다.',
            actionBadge: 'revalidatePath 실행',
          },
          {
            step: 3,
            title: "'패턴, type 누락'도 실행",
            description: '패턴 경로에 type을 빼면 아무 경로도 재생성되지 않고 서버 콘솔에 경고가 남는지 확인합니다.',
            actionBadge: '결과 비교',
            observe: '구체 경로는 /products/1만, 패턴 + page는 1·2·3 모두, type 누락은 아무것도 재생성하지 않음',
            observeAt: 'verification',
          },
        ]}
      />
      <RevalidateLab />
      <ConceptDeepDive />
    </DemoContainer>
  )
}
