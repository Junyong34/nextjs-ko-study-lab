import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/route-segment-config/runtime-nodejs-edge')

import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { RuntimeContrastSection } from './components/RuntimeContrastSection'
import { RuntimeConceptCard } from './components/RuntimeConceptCard'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="export const runtime = 'nodejs' | 'edge'"
        concept="같은 코드라도 세그먼트의 runtime 설정에 따라 다른 서버 런타임에서 실행됩니다. 본문이 똑같은 Route Handler 세 개(runtime 미지정, 'nodejs', 'edge')를 실제로 호출해 각 런타임이 스스로 보고하는 식별값을 나란히 비교합니다. Next.js 16에서 'edge'는 deprecated입니다."
        steps={[
          {
            step: 1,
            title: '세 route.ts의 코드 비교',
            description: '실습 영역 상단 카드에서 세 파일의 차이가 runtime 선언 한 줄뿐인지 확인합니다.',
            actionBadge: '코드 대조',
          },
          {
            step: 2,
            title: '측정 표에서 NEXT_RUNTIME과 typeof EdgeRuntime 확인',
            description: '페이지를 열면 ./default, ./node, ./edge를 동시에 fetch합니다. 기본값과 nodejs는 같은 값을, edge만 다른 값을 돌려줍니다.',
            actionBadge: '실측',
            observe: 'NEXT_RUNTIME이 nodejs/nodejs/edge로, typeof EdgeRuntime이 undefined/undefined/string으로 갈리는지',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[세 엔드포인트 다시 측정] 버튼으로 재호출',
            description: 'measuredAt이 매번 바뀌어 캐시된 값이 아님을 확인하고, Node 전용 API 행에서 edge만 실패하는지 봅니다.',
            actionBadge: '재측정',
            observe: '세 엔드포인트 모두 기대와 일치하면 검증 완료로 바뀜',
            observeAt: 'verification',
          },
        ]}
      />
      <RuntimeContrastSection />
      <RuntimeConceptCard />
    </DemoContainer>
  )
}
