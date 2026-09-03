import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/headers/user-agent-device')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { HeadersUserAgentDemo } from './components/HeadersUserAgentDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="headers().get('user-agent') 기기 식별 및 최적화"
        concept="await headers()를 호출하여 수신된 HTTP User-Agent 헤더를 서버사이드에서 파싱하고 모바일/데스크톱 기기별 최적화 뷰를 동적으로 렌더링합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "기기별 렌더링을 테스트할 상품을 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "headers().get('user-agent')를 파싱하는 서버 함수를 실행합니다.",
            actionBadge: "헤더 파싱",
          },
          {
            step: 3,
            title: "기기 식별 결과 및 도메인 로그 관찰",
            description: "파싱된 브라우저/기기 정보와 함께 주문 동기화 결과가 실시간 로그에 반영되는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "수신된 User-Agent 헤더 기반 기기 식별 결과가 실시간 도메인 로그에 정상 기록됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"headers().get('user-agent') 기기 식별 및 최적화 실습"}>
        <HeadersUserAgentDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
