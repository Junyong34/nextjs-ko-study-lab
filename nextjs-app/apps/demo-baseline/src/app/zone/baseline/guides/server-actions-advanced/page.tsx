import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { AdvancedActionForm } from './components/AdvancedActionForm'
import { VerificationFooter } from './components/VerificationFooter'

export default function ServerActionsAdvancedDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Server Action 폼 검증 & useActionState 실시간 할인"
        concept="React 19의 useActionState 훅과 Server Action을 활용하면, 별도의 REST API 엔드포인트 없이도 서버 사이드 쿠폰 유효성 검증과 할인 계산을 1회의 서버 통신으로 우아하게 처리할 수 있습니다."
        steps={[
          {
            step: 1,
            title: '쿠폰 코드 입력 (예: NEXTJS16, VIPSTUDY)',
            description: '입력창에 프로모션 코드를 입력하고 [쿠폰 적용]을 클릭합니다.',
            actionBadge: 'Server Action 호출',
          },
          {
            step: 2,
            title: 'useActionState pending 대기',
            description: '400ms 동안 버튼이 비활성화되며 로딩 상태가 안전하게 제어됩니다.',
            actionBadge: 'isPending 제어',
          },
          {
            step: 3,
            title: '최종 결제 금액 자동 반영',
            description: '서버에서 계산된 할인 금액이 총액에서 즉시 차감되어 표시되는 것을 확인합니다.',
            actionBadge: '단일 라운드트립 완료',
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
