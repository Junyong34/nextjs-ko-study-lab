import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { PropsSerializationDemo } from './components/PropsSerializationDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"RSC에서 RCC로의 Props 직렬화(Serialization) 경계"}
        concept={"Server Component에서 Client Component로 전달되는 props는 JSON 직렬화 가능 객체(문자열, 숫자, Date, 순수 객체)여야 하며 함수나 클래스 인스턴스는 경계를 통과할 수 없습니다."}
        steps={[
          {
                    "step": 1,
                    "title": "직렬화 가능한 Props(상품명, 가격, Date) 구조 확인 및 직렬화 불가 객체(함수, 클래스 메서드) 차단 규칙 검사",
                    "description": "서버에서 안전하게 직렬화되어 클라이언트로 전송된 데이터 페이로드를 점검합니다. RSC-RCC 경계에서 클라이언트 컴포넌트로 함수를 직접 전달할 수 없는 Next.js 런타임 제약을 확인합니다.",
                    "actionBadge": "직렬화 데이터 점검"
          },
          {
                    "step": 2,
                    "title": "클라이언트 컴포넌트에서의 안전한 Props 수신 및 렌더링 관찰",
                    "description": "역직렬화된 JSON 데이터가 클라이언트 컴포넌트에서 깨짐 없이 정상 렌더링되는 과정을 확인합니다.",
                    "actionBadge": "경계 전달 검증",
                    "observe": "RSC에서 RCC로 전달된 직렬화 데이터(상품 스펙, ISO Date)의 클라이언트 정상 수신 및 렌더링 관찰",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"Props 직렬화 경계 및 안전한 전달 실습"}>
        <PropsSerializationDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
