import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FormStatusDemo } from './components/FormStatusDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"useFormStatus pending 스피너 및 버튼 비활성화"}
        concept={"부모 <form>의 제출 진행 상태를 Props Drilling 없이 하위 <SubmitButton>에서 useFormStatus()로 직접 구독하여 1200ms 결제 통신 중 버튼을 disabled 처리하고 스피너를 노출합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "결제 주문자 및 배송지 정보 입력",
                    "description": "주문 결제 폼에 결제 수단 및 주문자 정보를 입력합니다.",
                    "actionBadge": "주문 정보 입력"
          },
          {
                    "step": 2,
                    "title": "[💳 189,000원 즉시 결제 승인 (useFormStatus)] 클릭",
                    "description": "결제 버튼을 클릭하여 Server Action 결제 프로세스를 시작합니다.",
                    "actionBadge": "결제 요청"
          },
          {
                    "step": 3,
                    "title": "pending 상태 동안 버튼 비활성화 및 스피너 로딩 확인",
                    "description": "useFormStatus 훅이 pending: true를 감지하여 중복 제출을 방지하고 스피너를 표시하는지 확인합니다.",
                    "actionBadge": "pending 감지"
          },
          {
                    "step": 4,
                    "title": "결제 승인 완료 및 주문 결과 관찰",
                    "description": "서버 통신 완료 후 pending이 false로 전환되며 결제 완료 확인 패널이 활성화되는지 관찰합니다.",
                    "actionBadge": "결제 완료 관찰",
                    "observe": "useFormStatus.pending 플래그에 따라 결제 버튼 비활성화 및 로딩 스피너가 정확히 동기화됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"useFormStatus pending 스피너 및 버튼 비활성화 실습"}>
        <FormStatusDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
