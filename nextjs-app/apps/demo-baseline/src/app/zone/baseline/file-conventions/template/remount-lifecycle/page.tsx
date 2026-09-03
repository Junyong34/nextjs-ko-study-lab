import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/template/remount-lifecycle')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TemplateRemountDemo } from './components/TemplateRemountDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"template.tsx 인스턴스 재생성 및 수명주기"}
        concept={"layout.tsx와 달리 template.tsx는 경로 이동 시마다 새로운 컴포넌트 인스턴스를 생성하므로 내부 React useState와 DOM 애니메이션이 매번 리셋됩니다."}
        steps={[
        {
        "step": 1,
        "title": "[경로 이동해도 유지됨...] 및 [경로 이동 시 초기화됨...] 입력",
        "description": "layout.tsx의 지속 인풋과 template.tsx의 리셋 인풋에 각각 텍스트를 입력합니다.",
        "actionBadge": "값 입력"
        },
        {
        "step": 2,
        "title": "[탭 A 진입 (/tab-a) →] 클릭",
        "description": "서브 라우트로 이동하며 template.tsx가 재마운트되고 마운트 시각이 갱신됩니다.",
        "actionBadge": "탭 A 이동"
        },
        {
        "step": 3,
        "title": "[탭 B 진입 (/tab-b) →] 또는 [탭 B로 이동 →] 클릭",
        "description": "탭 간 이동 시 layout의 입력값은 남고 template의 입력값은 초기화되는 차이를 확인합니다.",
        "actionBadge": "재마운트 확인",
        "observe": "layout.tsx의 입력값 보존과 template.tsx의 인풋 초기화 및 새 마운트 시각 갱신 확인",
        "observeAt": "playground"
        }
        ]}
        />
      <DemoPlaygroundCard title={"template.tsx 인스턴스 재생성 및 수명주기 실습"}>
        <TemplateRemountDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
