import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ModalInterceptionClient } from './components/ModalInterceptionClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function InterceptingRoutesDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Intercepting Routes ((..)segment) 라우트 인터셉트"
        concept="Intercepting Routes는 현재 페이지 컨텍스트(목록, 스크롤)를 유지한 채 다른 라우트의 내용을 모달 오버레이로 가로채어 보여주며, 사용자가 URL을 직접 공유하거나 새로고침했을 때는 전체 독립 페이지로 렌더링되게 합니다."
        steps={[
          {
            step: 1,
            title: '상품 카드 [모달로 보기] 클릭',
            description: '목록 페이지 위에 (..)products/[id] 인터셉트 모달이 오버레이되는 것을 확인합니다.',
            actionBadge: '라우트 인터셉트',
          },
          {
            step: 2,
            title: '배경 컨텍스트 보존 관찰',
            description: '모달 뒤로 원래 상품 목록과 배경 레이아웃이 깨지지 않고 온전히 유지됨을 봅니다.',
            actionBadge: '컨텍스트 보존',
          },
          {
            step: 3,
            title: '새로고침 vs 인터셉트 차이 학습',
            description: '하단 개념 정리 카드에서 직접 URL 접근 시 전체 페이지로 분기되는 원리를 학습합니다.',
            actionBadge: 'URL 진입 분기',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="이커머스 상품 갤러리 & 인터셉트 상세 모달" className="space-y-4">
        <ModalInterceptionClient />
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
