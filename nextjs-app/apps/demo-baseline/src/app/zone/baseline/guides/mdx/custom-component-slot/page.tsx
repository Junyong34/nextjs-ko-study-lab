import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MdxCustomSlotDemo } from './components/MdxCustomSlotDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"MDX 본문 내 커스텀 인터랙티브 리액트 컴포넌트 주입"}
        concept={"MDX 렌더러의 컴포넌트 매핑을 통해 정적 마크다운(HTML) 본문 중간에 <BuyButton />과 같은 클라이언트 인터랙티브 컴포넌트(RCC, 149,000원)를 슬롯 형태로 자연스럽게 삽입합니다."}
        steps={[
          {
            step: 1,
            title: "MDX 본문 내 주입된 구매 컴포넌트 (<BuyButton />) 확인",
            description: "정적 마크다운 텍스트 사이에 삽입된 파란색 구매 버튼 UI를 확인합니다.",
            actionBadge: "슬롯 컴포넌트 확인",
          },
          {
            step: 2,
            title: "[라이브 테마 토글] 클릭",
            description: "MDX 본문 내부의 인터랙티브 버튼을 클릭하여 장바구니 추가 상태를 트리거합니다.",
            actionBadge: "인라인 구매 클릭",
          },
          {
            step: 3,
            title: "마크다운 내 클라이언트 상태 변경 및 장바구니 담김 관찰",
            description: "정적 문서 안에서도 인터랙티브 React 상태(added: true)가 정상 동작함을 검증합니다.",
            actionBadge: "컴포넌트 동작 검증",
            observe: "MDX 본문 내 <BuyButton /> 클릭 시 즉각 장바구니 담김 상태로 전환되는 인터랙션 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"MDX 내 인터랙티브 장바구니 버튼 합성 실습"}>
        <MdxCustomSlotDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
