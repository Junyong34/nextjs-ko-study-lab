import React from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { CategoryNav } from './components/CategoryNav'
import { RootNestedProvider } from './components/RootNestedContext'
import { VerificationFooter } from './components/VerificationFooter'

export default function NestedLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootNestedProvider>
      <DemoContainer className="space-y-6">
        <DemoGuideCard
          title={"루트 및 중첩 layout.tsx 계층 구조와 상태 보존"}
          concept={"이 layout.tsx는 clothing/electronics/food 세 실제 서브 라우트의 공통 부모다. 하위 page.tsx가 교체되어도 layout은 리마운트되지 않으므로 카운터 클릭 상태가 그대로 유지된다."}
          steps={[
            {
              step: 1,
              title: "카운터를 몇 번 클릭",
              description: "layout.tsx 안의 클라이언트 상태를 변경합니다.",
              actionBadge: "상태 변경",
            },
            {
              step: 2,
              title: "[전자기기], [식품] 탭으로 실제 이동",
              description: "실제 서브 라우트로 이동합니다.",
              actionBadge: "실제 이동",
            },
            {
              step: 3,
              title: "카운터 값이 유지되는지 확인",
              description: "페이지가 바뀌어도 layout의 카운터가 리셋되지 않아야 합니다.",
              actionBadge: "상태 보존 검증",
              observe: "카테고리 이동 전후 카운터 값 유지 관찰",
              observeAt: "verification",
            },
          ]}
        />
        <CategoryNav />
        {children}
        <VerificationFooter />
      </DemoContainer>
    </RootNestedProvider>
  )
}
