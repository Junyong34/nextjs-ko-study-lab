import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'architecture/accessibility/form-aria-support')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ArchA11yFormDemo } from './components/ArchA11yFormDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"웹 접근성(A11y) 표준 ARIA 속성(aria-invalid, aria-describedby) 연동 폼"}
        concept={"폼 입력 검증 실패 시 <input aria-invalid=\"true\" aria-describedby=\"card-error\">와 role=\"alert\"를 실시간 연결하여 스크린 리더 보조공학기기가 유효성 에러를 즉각 음성 안내하도록 지원합니다."}
        steps={[
          {
            step: 1,
            title: "[1234-5678-9012-3456] 카드 번호 입력 필드 확인",
            description: "신용카드 번호 라벨과 aria-invalid=\"true\"가 지정된 입력창을 확인합니다.",
            actionBadge: "접근성 필드 확인",
          },
          {
            step: 2,
            title: "aria-describedby=\"card-error\" 연결 관계 점검",
            description: "입력창과 하단 에러 메시지 div id가 정확히 일치하여 스크린 리더에 연계되는지 확인합니다.",
            actionBadge: "ARIA 속성 점검",
          },
          {
            step: 3,
            title: "role=\"alert\" 에러 메시지 연동 관찰",
            description: "스크린 리더 사용자에게 실시간 음성 경고([주의]️ 카드 번호 16자리를 입력해주세요.)가 전송되는 라이브 리전(Live Region) 동작을 검증합니다.",
            actionBadge: "접근성 검증",
            observe: "aria-invalid=\"true\" 및 aria-describedby로 연결된 role=\"alert\" 에러 메시지 연동 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"결제/주문 폼 WAI-ARIA 속성 및 스크린 리더 지원 실습"}>
        <ArchA11yFormDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
