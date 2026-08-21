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
        title="Next.js 실제 template.tsx 파일 규칙 & 인스턴스 재생성"
        concept="layout.tsx는 페이지를 이동해도 인스턴스를 유지(상태 보존)하지만, template.tsx는 라우팅할 때마다 새로운 컴포넌트 인스턴스를 생성(Re-mount)하여 폼 상태나 애니메이션을 새로 시작합니다."
        steps={[
          {
            step: 1,
            title: '후기 입력창에 텍스트 작성',
            description: '하단 template 폼의 평점을 선택하고 후기 글을 작성합니다.',
            actionBadge: '상태 생성',
          },
          {
            step: 2,
            title: '다른 상품 탭 Link 클릭',
            description: '상단 탭에서 [오버핏 기모 맨투맨] 링크를 눌러 실제 라우트로 이동합니다.',
            actionBadge: '실제 라우트 전환',
          },
          {
            step: 3,
            title: '인스턴스 재생성 확인',
            description: 'template.tsx가 Re-mount되어 인스턴스 ID가 새로 발급되고 폼이 리셋된 것을 봅니다.',
            actionBadge: '템플릿 리셋 검증',
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
