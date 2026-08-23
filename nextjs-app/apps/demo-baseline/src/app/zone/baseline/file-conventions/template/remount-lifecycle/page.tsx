import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TemplateRemountDemo } from './components/TemplateRemountDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"template.tsx 인스턴스 재생성 및 수명주기"}
        concept={"같은 세그먼트에 layout.tsx와 template.tsx를 함께 두면 경로 이동 시 layout은 인스턴스를 유지하고 template은 매번 새로 만듭니다. 초록 입력칸은 값이 남고 보라 입력칸은 초기화되는 이유가 이것입니다."}
        steps={[
          {
            step: 1,
            title: "두 입력칸에 각각 값 입력",
            description: "초록 [경로 이동해도 유지됨...]과 보라 [경로 이동 시 초기화됨...] 두 곳에 아무 텍스트나 넣습니다.",
            actionBadge: "상태 주입",
          },
          {
            step: 2,
            title: "[탭 A 진입 (/tab-a) →] 클릭",
            description: "서브 라우트로 이동하며 template.tsx가 재마운트되고 마운트 시각이 갱신됩니다.",
            actionBadge: "경로 이동",
          },
          {
            step: 3,
            title: "[탭 B로 이동 →] 클릭",
            description: "한 번 더 이동해 layout과 template의 상태 보존 차이를 반복 확인합니다.",
            actionBadge: "재마운트",
            observe: "layout.tsx 입력값은 남고 template.tsx 입력값은 비워지며, 보라 배지의 [마운트 시각]이 이동할 때마다 새 시각으로 바뀜",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"template.tsx 인스턴스 재생성 및 수명주기 실습"}>
        <TemplateRemountDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
