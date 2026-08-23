'use client'

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TabNavigator } from './components/TabNavigator'
import { VerificationFooter } from './components/VerificationFooter'

export default function TemplateLifecycleRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="template.tsx 파일 컨벤션 & 네비게이션 시 인스턴스 재생성"
        concept="layout.tsx와 달리 template.tsx는 라우트 이동 시마다 기존 인스턴스를 언마운트하고 새로운 인스턴스를 생성(Re-mount)하여 폼 입력값과 애니메이션 상태를 100% 자동 초기화합니다."
        steps={[
          {
            step: 1,
            title: '[이 상품에 대한 솔직한 후기를 남겨주세요...] 작성',
            description: '하단 템플릿 영역에서 별점을 선택하고 후기 입력창에 텍스트를 작성합니다.',
            actionBadge: '폼 상태 입력',
          },
          {
            step: 2,
            title: '[2. 오버핏 기모 맨투맨] 탭 클릭',
            description: '상단 탭 네비게이터에서 [2. 오버핏 기모 맨투맨] 링크를 클릭하여 다른 상품 라우트로 이동합니다.',
            actionBadge: '라우트 이동',
          },
          {
            step: 3,
            title: '인스턴스 ID 재생성 & 폼 리셋 확인',
            description: 'template.tsx가 Re-mount되어 인스턴스 고유 ID(#ID)가 새로 발급되고 작성 중이던 후기 폼이 깨끗하게 리셋된 것을 관찰합니다.',
            actionBadge: '인스턴스 재생성',
            observe: '인스턴스 고유 ID(#ID)가 새로 갱신되고 작성 중이던 후기 폼 텍스트와 별점이 초기화됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="상품 탭 전환 및 후기 작성 폼" className="space-y-4">
        {/* Next.js Link 탭 네비게이션 */}
        <TabNavigator />

        {/* template.tsx 래퍼를 거친 실제 page.tsx 콘텐츠 */}
        {children}
      </DemoPlaygroundCard>

      {/* 3단 및 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
