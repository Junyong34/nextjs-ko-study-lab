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
        concept={"template.tsx는 페이지 전환 시마다 React 트리를 언마운트 후 다시 마운트하여 CSS slide-in-from-bottom 애니메이션을 매번 재생하고 폼 입력값(훌륭한 상품입니다!)을 리셋합니다."}
        steps={[
        {
        "step": 1,
        "title": "[훌륭한 상품입니다!] 텍스트 입력 수정",
        "description": "template.tsx 영역의 후기 작성 폼에 임의의 텍스트를 입력합니다.",
        "actionBadge": "폼 입력"
        },
        {
        "step": 2,
        "title": "페이지 라우트 전환 실행",
        "description": "다른 서브 페이지로 이동하여 template의 수명 주기 전환을 유도합니다.",
        "actionBadge": "페이지 전환"
        },
        {
        "step": 3,
        "title": "인스턴스 리셋 및 애니메이션 재생 확인",
        "description": "새 페이지 진입 시 이전 입력값이 깨끗이 비워지고 CSS 페이드인 애니메이션이 재실행되는지 확인합니다.",
        "actionBadge": "리셋 확인",
        "observe": "3단 검증 패널에서 template.tsx의 인스턴스 재생성 및 상태 리셋 사양 충족 확인",
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
