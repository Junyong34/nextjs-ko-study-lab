import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { InlineActionClosureDemo } from './components/InlineActionClosureDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use server' 함수 인라인 클로저 Server Action"}
        concept={"서버 컴포넌트 함수 내부에서 async function buyProduct() { 'use server'; ... } 형태로 선언하면 상위 스코프의 변수(productId, price)를 암호화된 클로저로 자동 캡처하여 안전하게 실행합니다."}
        steps={[
        {
        "step": 1,
        "title": "구매 대상 상품 카드 선택",
        "description": "인라인 Server Action으로 주문할 상품 항목을 선택합니다.",
        "actionBadge": "상품 선택"
        },
        {
        "step": 2,
        "title": "[원클릭 즉시 구매] 클릭",
        "description": "상위 스코프 변수가 바인딩된 인라인 'use server' 함수를 비동기 호출합니다.",
        "actionBadge": "즉시 구매"
        },
        {
        "step": 3,
        "title": "클로저 인자 암호화 및 주문 완료 확인",
        "description": "클라이언트에서 변조할 수 없도록 서명된 클로저 인자가 서버에서 안전하게 해소되어 주문이 완료되는지 확인합니다.",
        "actionBadge": "주문 완료",
        "observe": "원클릭 구매 후 결제 완료 상태와 3단 검증 패널의 인라인 Server Action 응답 일치 확인",
        "observeAt": "playground"
        }
        ]}
        />
      <DemoPlaygroundCard title={"컴포넌트 내부 인라인 'use server' 클로저 액션 실습"}>
        <InlineActionClosureDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
