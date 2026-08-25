import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { NotFoundTriggerDemo } from './components/NotFoundTriggerDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="notFound() 404 트리거 및 not-found.tsx 렌더"
        concept="서버 컴포넌트나 Route Handler에서 존재하지 않는 리소스 조회 시 notFound()를 호출하여 HTTP 404 상태 코드와 함께 가장 인접한 not-found.tsx UI를 렌더링합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "조회할 상품 ID 컨텍스트를 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "존재하지 않는 상품 조회를 시뮬레이션하여 notFound()를 트리거합니다.",
            actionBadge: "notFound 실행",
          },
          {
            step: 3,
            title: "HTTP 404 상태 코드 및 not-found.tsx 렌더 관찰",
            description: "HTTP 404 에러와 함께 not-found.tsx 파일 컨벤션이 화면에 격리 렌더링되는지 확인합니다.",
            actionBadge: "404 검증",
            observe: "notFound() 호출 즉시 HTTP 404 응답과 함께 not-found.tsx 뷰가 실시간 로그에 반영됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"notFound() 404 트리거 및 not-found.tsx 렌더 실습"}>
        <NotFoundTriggerDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
