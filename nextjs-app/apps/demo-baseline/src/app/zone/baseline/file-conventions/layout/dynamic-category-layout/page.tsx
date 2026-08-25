import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DynamicCategoryLayoutDemo } from './components/DynamicCategoryLayoutDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"[category]/layout.tsx 동적 카테고리 레이아웃"}
        concept={"동적 세그먼트 [category]에 배치된 layout.tsx는 params.category 변경 시 새로운 카테고리 테마로 전환되며, 동일 카테고리 내에서는 레이아웃 인스턴스를 유지합니다."}
        steps={[
        {
        "step": 1,
        "title": "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
        "description": "카테고리별 상품을 선택하여 동적 파라미터 변경을 준비합니다.",
        "actionBadge": "상품 선택"
        },
        {
        "step": 2,
        "title": "[+] 또는 [-] 수량 조절",
        "description": "주문 수량을 변경하여 로컬 인터랙션 상태를 갱신합니다.",
        "actionBadge": "수량 조절"
        },
        {
        "step": 3,
        "title": "[동작 실행] 클릭",
        "description": "선택한 카테고리 파라미터와 수량 데이터를 레이아웃 컨텍스트에 동기화합니다.",
        "actionBadge": "동기화 실행",
        "observe": "선택된 카테고리 라우트 정보와 3단 검증 패널의 동적 레이아웃 파라미터 바인딩 상태 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"[category]/layout.tsx 동적 카테고리 레이아웃 실습"}>
        <DynamicCategoryLayoutDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
