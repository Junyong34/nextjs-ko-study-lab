import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/next-response/rewrite-virtual')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RewriteEntryPlayground } from './components/RewriteEntryPlayground'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="NextResponse.rewrite() 가상 라우팅 중계"
        concept="proxy.ts에서 NextResponse.rewrite()를 실행하면 브라우저 주소창의 URL은 그대로 유지한 채, 서버 내부적으로 다른 실제 경로(target-event)의 콘텐츠를 대신 서빙합니다. 반면 NextResponse.redirect()는 브라우저에게 새 URL로 다시 요청하라고 지시하므로 주소창이 실제로 바뀝니다."
        steps={[
          {
            step: 1,
            title: '[가상 세일 페이지 입장] 클릭',
            description: 'proxy.ts가 ?scenario=rewrite 쿼리를 감지해 NextResponse.rewrite()로 target-event 콘텐츠를 내부 연결합니다.',
            actionBadge: 'rewrite 진입',
            observe: '주소창이 이 실습 페이지 그대로 유지된 채 세일 이벤트 콘텐츠가 표시됨',
            observeAt: 'verification',
          },
          {
            step: 2,
            title: '[레거시 상품 링크로 입장] 클릭',
            description: 'proxy.ts가 ?scenario=redirect 쿼리를 감지해 NextResponse.redirect()로 target-event 경로로 이동시킵니다.',
            actionBadge: 'redirect 진입',
            observe: '주소창이 /target-event 실제 경로로 바뀜',
            observeAt: 'verification',
          },
          {
            step: 3,
            title: '두 결과를 검증 패널에서 대조',
            description: '동일한 target-event/page.tsx 파일이 렌더링되지만, usePathname()으로 읽은 실제 주소가 두 경우에 다른지 확인합니다.',
            actionBadge: '주소창 대조',
          },
        ]}
      />
      <DemoPlaygroundCard title="NextResponse.rewrite() 가상 경로 라우팅 실습">
        <RewriteEntryPlayground />
      </DemoPlaygroundCard>
      <VerificationFooter variant="root" />
    </DemoContainer>
  )
}
