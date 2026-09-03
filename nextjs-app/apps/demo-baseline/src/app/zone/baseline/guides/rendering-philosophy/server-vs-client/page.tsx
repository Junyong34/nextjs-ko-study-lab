import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/rendering-philosophy/server-vs-client')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ServerVsClientDemo } from './components/ServerVsClientDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"RSC vs RCC 렌더링 철학 및 번들 격리"}
        concept={"데이터 패칭과 민감 로직은 Server Component(RSC, 0 KB 클라이언트 번들)에 배치하고, 이벤트 핸들러 및 브라우저 API가 필요한 인터랙션만 Client Component(RCC)로 분리합니다."}
        steps={[
          {
            step: 1,
            title: "RSC 서버 렌더링 상품 정보 영역 확인",
            description: "클라이언트 JS 번들에 포함되지 않고 서버에서 정적으로 생성된 HTML 블록을 확인합니다.",
            actionBadge: "RSC 영역 확인",
          },
          {
            step: 2,
            title: "[클릭 카운트:] 카운터 버튼 클릭 인터랙션 수행",
            description: "클라이언트 상태(useState)가 적용된 카운터 버튼을 클릭하여 RCC 인터랙션을 테스트합니다.",
            actionBadge: "RCC 인터랙션",
          },
          {
            step: 3,
            title: "서버 컴포넌트와 클라이언트 컴포넌트 경계 분리 관찰",
            description: "클라이언트 인터랙션이 발생해도 상위 RSC 영역이 재실행되지 않고 번들이 격리되는 구조를 확인합니다.",
            actionBadge: "경계 검증",
            observe: "RSC 정적 영역과 RCC 상호작용 컴포넌트의 번들 사이즈(0 KB vs Hydrated) 격리 상태 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"서버 렌더링 vs 클라이언트 렌더링 수명주기 대조 실습"}>
        <ServerVsClientDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
