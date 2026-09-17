import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/metadata-robots/dynamic-crawler-rules')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MetadataRobotsDemo } from './components/MetadataRobotsDemo'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="robots.ts 동적 크롤링 규칙 생성"
        concept="robots.ts는 app 루트에서만 /robots.txt로 라우팅되는 특수 파일이다. 코드 안의 규칙 함수가 반환한 값이 실제 응답 텍스트로 그대로 직렬화되는지, production/staging 두 모드를 실제 요청으로 대조해 실측한다."
        steps={[
          {
            step: 1,
            title: '[production 모드로 요청] 클릭',
            description: '실제 GET 요청이 preview 라우트로 전송되고, robots-rules.ts의 production 규칙(Googlebot 허용, 관리자/결제 경로 차단, Sitemap/Host)이 텍스트로 직렬화되어 돌아옵니다.',
            actionBadge: '실제 요청',
          },
          {
            step: 2,
            title: '[staging 모드로 요청] 클릭',
            description: '같은 라우트에 mode=staging으로 요청하면 서버가 다른 규칙(User-Agent: * 전체 차단)을 계산해 다른 텍스트를 응답합니다. 코드의 조건 분기가 실제 응답을 바꾸는 과정을 확인합니다.',
            actionBadge: '규칙 전환',
            observe: '두 응답 텍스트의 Disallow/Sitemap 라인 차이 및 3단 검증 패널의 실측 판정',
            observeAt: 'verification',
          },
        ]}
      />
      <DemoPlaygroundCard title="robots.ts 규칙 함수 → 실제 robots.txt 응답 (preview 라우트)">
        <MetadataRobotsDemo />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
