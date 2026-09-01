import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UseParamsClientDemo } from './components/UseParamsClientDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="useParams()를 이용한 Client Component 다이나믹 세그먼트 파라미터 추출"
        concept="useParams() 훅으로 Client Component 안에서 다이나믹 라우트 세그먼트([category], [id])의 파라미터를 읽고 타입에 맞게 사용합니다."
        steps={[
          {
            step: 1,
            title: "[/electronics/keyboard-900] 버튼 클릭",
            description: "카테고리와 상품 ID가 포함된 첫 번째 다이나믹 세그먼트 경로를 활성화합니다.",
            actionBadge: "경로 선택",
          },
          {
            step: 2,
            title: "[/fashion/hoodie-102] 버튼으로 전환",
            description: "두 번째 다이나믹 세그먼트 경로를 선택하여 useParams() 훅의 파라미터를 갱신합니다.",
            actionBadge: "파라미터 갱신",
          },
          {
            step: 3,
            title: "useParams() 반환 객체(category / id) 관찰",
            description: "useParams()가 추출한 category 및 id 문자열이 화면에 올바르게 추출되는지 확인합니다.",
            actionBadge: "파라미터 검증",
            observe: "useParams()로 추출된 category(\"electronics\"/\"fashion\")와 id가 화면에 일치함",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"useParams()를 이용한 Client Component 다이나믹 세그먼트 파라미터 추출 실습"}>
        <UseParamsClientDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
