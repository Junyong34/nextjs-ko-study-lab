import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/page/react-19-use-params')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { React19UseParamsDemo } from './components/React19UseParamsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"React 19 use(params) 비동기 파라미터 언래핑"}
        concept={"Next.js 15+ 및 React 19에서는 page.tsx의 params와 searchParams가 Promise로 주입되므로, use(params) 또는 await params로 비동기 언래핑해야 합니다."}
        steps={[
        {
        "step": 1,
        "title": "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
        "description": "언래핑할 타깃 상품 파라미터를 선택합니다.",
        "actionBadge": "상품 선택"
        },
        {
        "step": 2,
        "title": "[+] 수량 조절 후 [동작 실행] 클릭",
        "description": "주문 수량을 설정하고 Promise<params> 해소 로직을 트리거합니다.",
        "actionBadge": "use(params)"
        },
        {
        "step": 3,
        "title": "비동기 파라미터 언래핑 결과 확인",
        "description": "React 19 use() 훅이 Promise를 해소하여 추출한 id 및 category 값을 확인합니다.",
        "actionBadge": "언래핑 완료",
        "observe": "3단 검증 패널에서 use(params)를 통해 추출된 실제 상품 ID와 수량 동기화 결과 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"React 19 use(params)와 use(searchParams) 값 읽기 실습"}>
        <React19UseParamsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
