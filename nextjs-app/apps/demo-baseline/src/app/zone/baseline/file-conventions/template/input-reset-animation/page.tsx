import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/template/input-reset-animation')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TemplateAnimationDemo } from './components/TemplateAnimationDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"template.tsx 폼 리셋 및 진입 애니메이션"}
        concept={"template.tsx는 세그먼트 이동마다 고유한 key로 새 인스턴스를 마운트하므로, 그 안의 비제어(uncontrolled) 입력은 이전 값과 무관하게 항상 빈 DOM으로 다시 태어나고 CSS 진입 애니메이션도 매번 재생됩니다."}
        steps={[
        {
        "step": 1,
        "title": "[이 사이즈 재고 있나요?] 입력창에 문구 입력",
        "description": "template.tsx 영역(보라색 박스)의 상품 문의 입력창에 임의의 텍스트를 입력합니다.",
        "actionBadge": "폼 입력"
        },
        {
        "step": 2,
        "title": "[사이즈 문의 탭 진입 →] 또는 [색상 문의 탭 진입 →] 클릭",
        "description": "실제 서브 라우트로 이동하여 template.tsx를 실제로 언마운트·재마운트시킵니다.",
        "actionBadge": "탭 이동",
        "observe": "보라색 template 박스가 슬라이드 페이드인으로 다시 나타나고, 입력창이 비워짐",
        "observeAt": "playground"
        },
        {
        "step": 3,
        "title": "입력값 리셋 및 애니메이션 재생 확인",
        "description": "탭을 몇 차례 오가며, 초록색 layout 박스의 대조군 입력은 유지되는지도 함께 비교합니다.",
        "actionBadge": "리셋 확인",
        "observe": "3단 검증 패널에서 직전 값 소실 여부와 animationstart/animationend 발생 횟수 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"진입 애니메이션 및 폼 리셋 (template.tsx) 실습"}>
        <TemplateAnimationDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
