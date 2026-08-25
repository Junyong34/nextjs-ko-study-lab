import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { RedirectOrderDemo } from './components/RedirectOrderDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Server Action 내 redirect()를 통한 주문 완료 리다이렉트"}
        concept={"Next.js Server Action 내부에서 주문 DB 처리를 완료한 후 redirect() 함수를 호출하여 브라우저를 주문 완료 화면(/order/complete)으로 즉시 303 리다이렉트합니다."}
        steps={[
          {
            step: 1,
            title: "주문 결제 금액(219,000원) 및 배송지 정보 확인",
            description: "결제 진행 전 주문 요약 내역과 결제 버튼 라벨을 확인합니다.",
            actionBadge: "주문 요약 확인",
          },
          {
            step: 2,
            title: "[[결제] 219,000원 결제 및 완료 페이지 이동 (redirect)] 클릭",
            description: "Server Action을 실행하여 결제 승인 후 redirect() 예외를 발생시킵니다.",
            actionBadge: "결제 및 리다이렉트",
          },
          {
            step: 3,
            title: "주문 완료 페이지 전이 및 URL/상태 갱신 관찰",
            description: "클라이언트 라우터가 303 리다이렉트 응답을 받아 완료 화면으로 부드럽게 이동하는지 검증합니다.",
            actionBadge: "전이 검증",
            observe: "결제 버튼 클릭 후 주문 완료 상태 화면 전환 및 redirect()를 통한 라우트 전이 결과 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Server Action 내 redirect()를 통한 주문 완료 화면 이동 실습"}>
        <RedirectOrderDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
