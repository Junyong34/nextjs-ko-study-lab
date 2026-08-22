import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FormSearchClient } from './components/FormSearchClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function FormComponentDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js 빌트인 <Form> 컴포넌트 & GET 검색 동기화"
        concept="Next.js의 <Form> 컴포넌트는 클라이언트 사이드 탐색(Soft Navigation)과 결합되어, 별도의 router.push 코드 없이도 폼 입력을 URL searchParams와 자동으로 동기화합니다."
        steps={[
          {
            step: 1,
            title: '검색어 또는 카테고리 선택 후 제출',
            description: '검색어(예: 모니터)를 입력하고 [GET 검색 실행]을 누릅니다.',
            actionBadge: '<Form> GET 제출',
          },
          {
            step: 2,
            title: 'URL searchParams 자동 변경 확인',
            description: '전체 페이지 새로고침 없이 URL 쿼리(?q=모니터)와 상품 목록이 즉시 변경됩니다.',
            actionBadge: '소프트 네비게이션',
          },
          {
            step: 3,
            title: '공유 가능한 검색 URL 검증',
            description: '하단 개념 정리에서 next/form이 제공하는 프리패칭 및 점진적 향상 원리를 학습합니다.',
            actionBadge: 'URL 동기화 완료',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="이커머스 상품 카탈로그 검색 필터 (<Form> 기반)" className="space-y-4">
        <Suspense fallback={<div className="p-4 text-xs font-mono text-zinc-400">검색 폼 로딩 중...</div>}>
          <FormSearchClient />
        </Suspense>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
