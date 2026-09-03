import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/draft-mode/disable-preview')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DraftModeDisableDemo } from './components/DraftModeDisableDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="draftMode().disable() 정적 캐시 모드 복귀"
        concept="draftMode().disable()을 호출하여 초안 미리보기 바이패스 쿠키를 파기하고 고속 정적 캐시(SSG/ISR) 프로덕션 서빙 모드로 복귀합니다."
        steps={[
          {
            step: 1,
            title: "[draftMode().disable() 실행 (미리보기 닫기)] 클릭",
            description: "draftMode().disable()을 호출하여 활성화되어 있던 초안 미리보기 세션을 종료합니다.",
            actionBadge: "초안 모드 종료",
          },
          {
            step: 2,
            title: "__prerender_bypass 쿠키 제거 확인",
            description: "브라우저에서 바이패스 쿠키가 삭제되어 일반 사용자 캐시 서빙 상태로 전환되는 과정을 확인합니다.",
            actionBadge: "쿠키 파기",
          },
          {
            step: 3,
            title: "정적 프로덕션 캐시 렌더링 복귀 관찰",
            description: "초안 안내 뱃지가 사라지고 정식 발행된 고속 정적 캐시 상품 페이지로 복귀하는지 확인합니다.",
            actionBadge: "정적 복귀",
            observe: "draftMode().disable() 호출 후 초안 바이패스 쿠키가 삭제되고 정적 캐시 모드로 복귀함",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"draftMode().disable() 정적 캐시 모드 복귀 실습"}>
        <DraftModeDisableDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
