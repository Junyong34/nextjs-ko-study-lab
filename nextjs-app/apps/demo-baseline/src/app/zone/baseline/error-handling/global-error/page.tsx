import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ErrorLayerSimulator } from './components/ErrorLayerSimulator'
import { VerificationFooter } from './components/VerificationFooter'

export default function GlobalErrorDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="예상된 에러 vs 예외 vs global-error 계층 처리"
        concept="Next.js 에러는 세 가지 계층으로 구분됩니다: 1) 폼 유효성 등 예상된 에러는 useActionState 값으로 반환, 2) 세그먼트 예외는 error.tsx로 부분 격리, 3) 루트 레이아웃 크래시는 global-error.tsx로 전역 처리합니다."
        steps={[
          {
            step: 1,
            title: '잘못된 폼 데이터 제출',
            description: '이메일 형식 오류 및 0원 입력 상태에서 [주문 제출]을 클릭합니다.',
            actionBadge: '예상된 에러 발생',
          },
          {
            step: 2,
            title: '인라인 에러 메시지 확인',
            description: '화면이 깨지지 않고 useActionState를 통해 각 입력창 아래에 빨간 안내 문구가 뜸을 봅니다.',
            actionBadge: 'useActionState',
          },
          {
            step: 3,
            title: '에러 계층 아키텍처 학습',
            description: '하단 카드에서 error.tsx 및 global-error.tsx의 역할 분담을 학습합니다.',
            actionBadge: '계층 구조 이해',
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
