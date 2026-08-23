import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ErrorLayerSimulator } from './components/ErrorLayerSimulator'
import { VerificationFooter } from './components/VerificationFooter'

export default function GlobalErrorDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js 3계층 에러 핸들링 (Server Action Return vs error.tsx vs global-error.tsx)"
        concept="예상된 폼 유효성 에러는 useActionState의 400 반환값으로 처리하고, 런타임 예외는 세그먼트 error.tsx로 격리하며, Root Layout 크래시는 최상위 global-error.tsx로 전체 뷰를 보호합니다."
        steps={[
          {
            step: 1,
            title: '[잘못된 이메일 (예: invalid-email)] 폼 입력',
            description: '이메일 입력창에 잘못된 형식을 입력하고 400 검증 에러 반환 동작을 확인합니다.',
            actionBadge: '예상된 에러 처리',
          },
          {
            step: 2,
            title: '[2. 세그먼트 예외 던지기 (error.tsx Catch)] 클릭',
            description: '하위 세그먼트에서 발생한 예외가 상위 레이아웃을 파괴하지 않고 segment error.tsx에 격리 포착되는 것을 확인합니다.',
            actionBadge: '세그먼트 격리',
          },
          {
            step: 3,
            title: '[3. 루트 레이아웃 크래시 (global-error.tsx Catch)] 클릭',
            description: 'Root Layout 수준의 치명적 결함 발생 시 최상위 global-error.tsx가 전체 앱을 안전 폴백으로 감싸는 것을 관찰합니다.',
            actionBadge: 'Root 크래시 포착',
            observe: '3가지 에러 레벨(Form 400 인라인 ↔ Segment error.tsx ↔ Root global-error.tsx)별 격리 범위가 대조 시각화됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="Next.js 에러 핸들링 3대 계층 시뮬레이터" className="space-y-4">
        <ErrorLayerSimulator />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
