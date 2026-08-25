import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PaymentErrorBoundaryDemo } from './components/PaymentErrorBoundaryDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"error.tsx 클라이언트 에러 바운더리 격리"}
        concept={"결제 세그먼트의 error.tsx는 'use client'가 필수이며, 하위 결제 모듈에서 발생한 500 에러를 상위 레이아웃으로 전파하지 않고 해당 세그먼트에 국소 격리합니다."}
        steps={[
        {
        "step": 1,
        "title": "[결제 화면(checkout) 진입하기 →] 클릭",
        "description": "결제 서브 라우트로 이동하여 결제 폼 화면을 마운트합니다.",
        "actionBadge": "결제 진입"
        },
        {
        "step": 2,
        "title": "[💥 PG 결제 타임아웃 에러 강제 발생] 클릭",
        "description": "throw new Error('500 PG_TIMEOUT')를 실행하여 error.tsx 바운더리를 활성화합니다.",
        "actionBadge": "500 에러 발생"
        },
        {
        "step": 3,
        "title": "[다시 시도 (reset() 실행)] 클릭",
        "description": "error.tsx의 reset() 콜백을 실행하여 정상 결제 컴포넌트로 복구합니다.",
        "actionBadge": "reset() 복구",
        "observe": "에러 발생 시 상위 GNB는 유지되고 결제 영역만 에러 UI로 전환되며 reset() 복구되는 과정 확인",
        "observeAt": "playground"
        }
        ]}
        />
      <DemoPlaygroundCard title={"결제 세그먼트 에러 캡처 (error.tsx) 실습"}>
        <PaymentErrorBoundaryDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
