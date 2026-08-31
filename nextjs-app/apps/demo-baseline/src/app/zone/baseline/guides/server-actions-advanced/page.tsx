import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { AdvancedActionForm } from './components/AdvancedActionForm'

export default function ServerActionsAdvancedDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="고급 Server Action 상태 처리 및 폼 검증"
        concept="React 19 useActionState와 Server Action('use server')을 통해 서버사이드 비즈니스 유효성 검사 및 정액 할인 계산을 수행하고, 폼 상태를 클라이언트에 동기화합니다."
        steps={[
          {
            step: 1,
            title: '[쿠폰 코드를 입력하세요] 입력창에 할인 코드(NEXTJS16) 입력',
            description: '프로모션 쿠폰 코드(NEXTJS16: 15,000원, WELCOME2026: 10,000원, VIPSTUDY: 30,000원)를 입력합니다.',
            actionBadge: '쿠폰 입력',
          },
          {
            step: 2,
            title: '[쿠폰 적용] 버튼 클릭으로 서버 검증 실행',
            description: 'Server Action을 실행하여 서버사이드 유효성 검증(400ms)을 수행합니다.',
            actionBadge: '액션 전송',
          },
          {
            step: 3,
            title: '서버 검증 결과(할인 금액 반영 또는 유효성 에러) 관찰',
            description: '서버 유효성 검사 결과에 따른 할인 금액 반영 및 안내 배지를 확인합니다.',
            actionBadge: '검증 완료',
            observe: 'Server Action 반환값에 따른 쿠폰 할인(-15,000원) 적용 및 최종 결제 금액(204,000원) 갱신 관찰',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) 및 3단/4단 */}
      <DemoPlaygroundCard title="프로모션 쿠폰 적용 및 실시간 할인 계산기" className="space-y-4">
        <AdvancedActionForm />
      </DemoPlaygroundCard>
    </DemoContainer>
  )
}
