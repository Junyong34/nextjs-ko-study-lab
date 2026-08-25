import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { AdvancedActionForm } from './components/AdvancedActionForm'
import { VerificationFooter } from './components/VerificationFooter'

export default function ServerActionsAdvancedDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title={"고급 Server Action 상태 처리 및 폼 검증"}
        concept={"Server Action에서 Zod 유효성 검사 실패 시 필드별 에러 메시지를 반환하고, 성공 시 revalidatePath()를 호출하여 클라이언트 캐시와 UI를 자동 동기화합니다."}
        steps={[
          {
            step: 1,
            title: "[쿠폰 코드를 입력하세요] 입력창에 할인 코드(DISCOUNT2026) 입력",
            description: "쿠폰 코드 입력 필드에 유효하거나 유효하지 않은 코드를 입력합니다.",
            actionBadge: "쿠폰 입력",
          },
          {
            step: 2,
            title: "[쿠폰 적용] 버튼 클릭으로 서버 검증 실행",
            description: "Server Action을 실행하여 서버 사이드 스키마 유효성 검증 및 800ms 지연 처리를 수행합니다.",
            actionBadge: "액션 전송",
          },
          {
            step: 3,
            title: "서버 검증 결과(할인율 적용 또는 에러 메시지) 관찰",
            description: "서버 유효성 검사 결과에 따른 할인 금액 반영 및 안내 배지를 확인합니다.",
            actionBadge: "검증 완료",
            observe: "서버 액션 반환값에 따른 쿠폰 할인율(20%) 적용 또는 유효성 에러 메시지 노출 관찰",
            observeAt: "playground",
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="프로모션 쿠폰 적용 및 실시간 할인 계산기" className="space-y-4">
        <AdvancedActionForm />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
