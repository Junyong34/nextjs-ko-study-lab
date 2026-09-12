import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/error/payment-error-boundary')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PaymentErrorBoundaryDemo } from './components/PaymentErrorBoundaryDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"error.tsx 클라이언트 에러 바운더리 격리"}
        concept={"checkout/error.tsx는 'use client'가 필수인 React 에러 바운더리이며, 같은 checkout 세그먼트의 page.tsx만 감쌉니다. 에러가 발생해도 checkout/layout.tsx는 이 경계 밖에 있어 리마운트되지 않고, 에러가 세그먼트 밖으로 전파되지도 않습니다."}
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
        "description": "throw new Error(...)를 실행하여 checkout/error.tsx 바운더리를 활성화합니다.",
        "actionBadge": "런타임 에러 발생"
        },
        {
        "step": 3,
        "title": "[다시 시도 (reset() 실행)] 클릭",
        "description": "error.tsx의 reset() 콜백을 실행하여 정상 결제 컴포넌트로 복구합니다.",
        "actionBadge": "reset() 복구",
        "observe": "에러 전후로 checkout/layout.tsx 진행 배너의 마운트 ID가 바뀌지 않는지 확인 — 같은 세그먼트의 layout.tsx는 error.tsx에 감싸이지 않는다는 증거",
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
