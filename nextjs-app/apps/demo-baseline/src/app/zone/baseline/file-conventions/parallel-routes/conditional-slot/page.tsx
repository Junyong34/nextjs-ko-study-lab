import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ParallelConditionalDemo } from './components/ParallelConditionalDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"병렬 라우트 조건부 슬롯 분기 렌더링"}
        concept={"사용자 권한(Role)이나 로그인 세션 상태에 따라 layout.tsx에서 @admin 또는 @user 슬롯 중 하나를 선택적으로 마운트하여 200 OK 응답을 구성합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "사용자 권한 상태 확인 및 조건부 슬롯 마운트 실행",
                    "description": "현재 세션의 권한(일반 사용자 vs 관리자)에 따른 슬롯 분기 조건을 점검합니다. layout.tsx가 props로 전달받은 슬롯 중 권한에 맞는 슬롯 컴포넌트만 렌더링합니다.",
                    "actionBadge": "세션 점검"
          },
          {
                    "step": 2,
                    "title": "권한별 슬롯 UI 노출 확인",
                    "description": "관리자에게는 관리 대시보드 슬롯이, 일반 사용자에게는 마이페이지 슬롯이 노출되는지 확인합니다.",
                    "actionBadge": "UI 확인",
                    "observe": "3단 검증 패널에서 세션 역할에 따라 올바른 조건부 병렬 슬롯이 활성화되는지 대조",
                    "observeAt": "verification"
          }
]}
        />
      <DemoPlaygroundCard title={"권한별 조건부 슬롯 분기 (Parallel Routes) 실습"}>
        <ParallelConditionalDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
