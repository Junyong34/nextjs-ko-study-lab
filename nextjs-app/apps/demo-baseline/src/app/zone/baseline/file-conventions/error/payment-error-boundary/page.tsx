import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PaymentErrorBoundaryDemo } from './components/PaymentErrorBoundaryDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"결제 세그먼트 에러 캡처 (error.tsx)"}
        concept={"checkout 세그먼트에 error.tsx를 두면 그 하위 렌더링 에러만 격리해 잡습니다. 결제 화면이 터져도 상위 레이아웃은 살아 있고, reset()으로 해당 세그먼트만 다시 렌더링할 수 있습니다."}
        steps={[
          {
            step: 1,
            title: "[결제 화면(checkout) 진입하기 →] 클릭",
            description: "결제 예정 금액 149,000원이 표시된 checkout/page.tsx가 정상 마운트됩니다.",
            actionBadge: "정상 상태",
          },
          {
            step: 2,
            title: "[PG 결제 타임아웃 에러 강제 발생] 클릭",
            description: "shouldThrow가 true로 바뀌며 렌더링 중 HTTP 504 Gateway Timeout 에러를 던집니다.",
            actionBadge: "에러 발생",
          },
          {
            step: 3,
            title: "error.tsx 포착 화면에서 reset() 실행",
            description: "checkout/error.tsx가 에러를 가로채 복구 UI를 띄웁니다. reset()을 누르면 세그먼트가 재렌더링됩니다.",
            actionBadge: "복구",
            observe: "에러가 나도 상위 레이아웃과 데모 컨테이너는 그대로 남는지, reset() 후 결제 화면이 149,000원 초기 상태로 돌아오는지 확인",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"결제 세그먼트 에러 캡처 (error.tsx) 실습"}>
        <PaymentErrorBoundaryDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
