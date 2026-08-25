import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProgrammaticNotFoundDemo } from './components/ProgrammaticNotFoundDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"notFound() 프로그래밍 방식 404 트리거"}
        concept={"서버 컴포넌트나 Server Action에서 notFound()를 호출하면 NEXT_NOT_FOUND 예외를 던져 가장 가까운 not-found.tsx 화면으로 즉시 전환합니다."}
        steps={[
        {
        "step": 1,
        "title": "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
        "description": "존재하지 않는 상품 조회를 시뮬레이션할 기본 항목을 선택합니다.",
        "actionBadge": "항목 선택"
        },
        {
        "step": 2,
        "title": "[+] 수량 조절 후 [동작 실행] 클릭",
        "description": "유효하지 않은 요청 조건을 전달하여 notFound() 호출 분기를 실행합니다.",
        "actionBadge": "notFound() 트리거"
        },
        {
        "step": 3,
        "title": "404 상태 및 not-found.tsx 전환 확인",
        "description": "notFound()가 실행되어 404 HTTP 상태 코드와 전용 안내 UI가 렌더링되는지 확인합니다.",
        "actionBadge": "404 확인",
        "observe": "3단 검증 패널에서 notFound() 호출에 따른 404 응답과 UI 전환 상태 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"notFound() 프로그래밍 트리거 실습"}>
        <ProgrammaticNotFoundDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
