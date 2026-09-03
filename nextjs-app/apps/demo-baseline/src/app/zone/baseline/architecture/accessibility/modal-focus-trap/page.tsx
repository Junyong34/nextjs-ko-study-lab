import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'architecture/accessibility/modal-focus-trap')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ArchA11yFocusTrapDemo } from './components/ArchA11yFocusTrapDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"접근성 Focus Trap 및 키보드(Tab / Esc) 내비게이션 모달"}
        concept={"모달 다이얼로그 열림 시 role=\"dialog\" aria-modal=\"true\"를 선언하고, Tab 키 입력 시 포커스가 모달 밖으로 탈출하지 않도록 가두며(Focus Trap) Esc 키로 0ms 즉시 닫히도록 보장합니다."}
        steps={[
          {
            step: 1,
            title: "[접근성 모달 열기 (Focus Trap)] 버튼 클릭",
            description: "모달을 열어 포커스를 모달 내부 첫 번째 포커스 가능 요소로 자동 이동시킵니다.",
            actionBadge: "모달 열기",
          },
          {
            step: 2,
            title: "Tab 키를 통한 모달 내부 포커스 순환(Focus Trap) 테스트",
            description: "키보드 Tab / Shift+Tab 입력 시 포커스가 모달 바깥 배경으로 빠져나가지 않음을 확인합니다.",
            actionBadge: "포커스 트랩 테스트",
          },
          {
            step: 3,
            title: "[닫기 (Esc 지원)] 버튼 또는 Esc 키 입력으로 모달 닫기",
            description: "모달 종료 시 원래 모달을 열었던 트리거 버튼으로 포커스가 복원되는지 검증합니다.",
            actionBadge: "포커스 복원 검증",
            observe: "모달 열림 시 포커스 가둠(aria-modal) 및 닫기 시 원래 버튼으로의 포커스 복원 동작 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"모달 다이얼로그 키보드 포커스 트랩(Focus Trap) 및 Esc 닫기 실습"}>
        <ArchA11yFocusTrapDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
