import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { UnstableNoStoreDemo } from './components/UnstableNoStoreDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"unstable_noStore() 동적 렌더링 명시적 선언"}
        concept={"쇼핑몰의 주문/회원/카탈로그 비즈니스 로직에서 Next.js 내장 함수 'unstable_noStore() 동적 렌더링 명시적 선언'을 활용하는 실무 개발 패턴입니다."}
        steps={[
          {
                    "step": 1,
                    "title": "함수 파라미터 및 컨텍스트 확인",
                    "description": "서버 또는 클라이언트 실행 환경에서 전달되는 인자를 확인합니다.",
                    "actionBadge": "인자 확인"
          },
          {
                    "step": 2,
                    "title": "함수 호출 및 비동기 처리",
                    "description": "함수를 호출하여 반환된 값이나 상태 변경 효과를 관찰합니다.",
                    "actionBadge": "함수 실행"
          },
          {
                    "step": 3,
                    "title": "비즈니스 규칙 반영 검증",
                    "description": "쇼핑몰 도메인 데이터가 올바르게 갱신되거나 제어되는지 확인합니다.",
                    "actionBadge": "결과 확인"
          }
]}
      />
      <DemoPlaygroundCard title={"unstable_noStore() 동적 렌더링 명시적 선언 실습"}>
        <UnstableNoStoreDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
