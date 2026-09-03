import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/forms/use-action-state-errors')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FormValidationDemo } from './components/FormValidationDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"useActionState 폼 유효성 검사 및 필드 에러 처리"}
        concept={"React 19 useActionState 훅을 통해 Server Action의 이전 상태와 폼 반환값(성공 여부, 필드별 에러 메시지)을 선언적으로 바인딩하고 비동기 제출 중 isPending 상태를 제어합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "[name@domain.com] 이메일 입력",
                    "description": "주문서 양식에 기본 이메일과 고객 정보를 작성합니다.",
                    "actionBadge": "양식 입력"
          },
          {
                    "step": 2,
                    "title": "[잘못된 이메일 (예: invalid-email)] 에러 유발 입력",
                    "description": "유효하지 않은 이메일 형식을 입력하여 유효성 검사 실패 조건을 만듭니다.",
                    "actionBadge": "에러 조건 유발"
          },
          {
                    "step": 3,
                    "title": "[서버 검증 중... 주문서 제출 및 검증] 클릭",
                    "description": "useActionState로 래핑된 Server Action을 디스패치합니다.",
                    "actionBadge": "서버 액션 제출"
          },
          {
                    "step": 4,
                    "title": "서버 유효성 검증 에러 메시지 및 필드 피드백 관찰",
                    "description": "서버에서 반환된 validation error 메시지가 각 폼 필드 하단에 실시간 렌더링되는지 관찰합니다.",
                    "actionBadge": "에러 피드백 관찰",
                    "observe": "useActionState 상태가 state.errors 객체를 수신하여 각 필드별 에러 피드백을 실시간 렌더링함",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"useActionState 필드 에러 표시 및 유효성 검증 실습"}>
        <FormValidationDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
