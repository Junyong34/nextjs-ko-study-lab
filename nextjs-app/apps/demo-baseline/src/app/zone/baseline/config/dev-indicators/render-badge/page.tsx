import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/dev-indicators/render-badge')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigDevIndicatorsDemo } from './components/ConfigDevIndicatorsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="devIndicators 렌더링 상태 개발 뱃지 제어"
        concept="next.config.ts의 devIndicators 설정을 통해 개발 환경 브라우저 화면 우측 하단에 표시되는 정적/동적 렌더링 인디케이터 뱃지의 노출 위치와 활성화 여부를 제어합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "렌더링 상태 뱃지 제어 대상 컴포넌트를 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "개발 뱃지 표시 설정과 연동된 렌더링 동작을 실행합니다.",
            actionBadge: "뱃지 제어",
          },
          {
            step: 3,
            title: "화면 렌더링 인디케이터 상태 및 도메인 로그 관찰",
            description: "정적/동적 세그먼트 상태를 나타내는 개발 인디케이터가 정상 동작하는지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "devIndicators 설정에 따라 화면 렌더링 상태 인디케이터 제어 정보가 실시간 반영됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"devIndicators 렌더링 상태 개발 뱃지 제어 실습"}>
        <ConfigDevIndicatorsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
