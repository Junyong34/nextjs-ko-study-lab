import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SingleParamDemo } from './components/SingleParamDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"단일 동적 세그먼트 [id] 및 params 언래핑"}
        concept={"items/[id]/page.tsx는 params를 Promise로 받습니다. await params로 언래핑해 꺼낸 id 값 하나로 상품 상세를 렌더링하며, 같은 파일이 모든 상품 ID를 처리합니다."}
        steps={[
          {
            step: 1,
            title: "[상세 보기 →] 클릭",
            description: "목록에서 상품 하나를 골라 /items/[id] 경로로 이동합니다.",
            actionBadge: "[id] 진입",
          },
          {
            step: 2,
            title: "URL의 id와 화면 데이터 대조",
            description: "await params로 꺼낸 id가 그대로 조회 키가 되어 해당 상품 정보가 바인딩됩니다.",
            actionBadge: "await params",
          },
          {
            step: 3,
            title: "[← 상품 목록으로 복귀] 후 다른 상품 진입",
            description: "다른 ID로 다시 들어가 같은 파일이 다른 데이터를 그리는지 봅니다.",
            actionBadge: "재사용 검증",
            observe: "page.tsx 파일은 하나인데 URL의 [id] 값에 따라 렌더링되는 상품이 바뀌는지 확인",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"[id] 단일 동적 세그먼트 실습"}>
        <SingleParamDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
