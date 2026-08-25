import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DrawerStateDemo } from './components/DrawerStateDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"레이아웃 유지 및 슬라이드 드로어 상태 보존"}
        concept={"하위 페이지 간 URL 이동이 발생해도 상위 layout.tsx에 선언된 장바구니 드로어(Drawer)의 열림 상태(isOpen)와 클라이언트 상태가 초기화되지 않고 안전하게 보존됩니다."}
        steps={[
          {
            step: 1,
            title: "장바구니 드로어 상태(열림) 및 [토글] 버튼 확인",
            description: "상위 레이아웃 레벨의 드로어 UI 초기 열림 상태(isOpen: true)를 확인합니다.",
            actionBadge: "초기 드로어 점검",
          },
          {
            step: 2,
            title: "[토글] 버튼 클릭으로 드로어 닫힘/열림 상태 변경",
            description: "상위 layout.tsx의 useState(isOpen) 값을 토글합니다.",
            actionBadge: "상태 토글",
          },
          {
            step: 3,
            title: "페이지 전환 중에도 드로어 열림 상태 유지 관찰",
            description: "하위 페이지만 교체되고 상위 레이아웃의 드로어가 닫히지 않고 유지되는 레이아웃 보존성을 검증합니다.",
            actionBadge: "상태 보존 검증",
            observe: "라우트 세그먼트 전이 시에도 상위 layout.tsx의 드로어 열림 상태(isOpen: true) 보존 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"카테고리 전환 시 장바구니 Drawer 열림 유지 실습"}>
        <DrawerStateDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
