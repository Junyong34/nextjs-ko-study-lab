import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/form-component')

import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FormSearchClient } from './components/FormSearchClient'
import { VerificationFooter } from './components/VerificationFooter'

export default function FormComponentDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title={"next/form 컴포넌트 자동 검색 쿼리 동기화"}
        concept={"<Form action=\"...\">을 사용하면 클라이언트 JS 없이도 폼 제출 시 URL 검색 쿼리(?q=...)로 자동 변환되고 페이지 전환 시 prefetching과 소프트 네비게이션이 적용됩니다."}
        steps={[
        {
        "step": 1,
        "title": "[상품명, 태그 검색 (예: 키보드, 무선, 데님)] 입력",
        "description": "검색어 입력창에 원하는 키워드(예: 키보드)를 입력합니다.",
        "actionBadge": "검색어 입력"
        },
        {
        "step": 2,
        "title": "[검색] 버튼 클릭",
        "description": "next/form이 GET 요청으로 폼 데이터를 직렬화하여 URL searchParams에 ?q=키보드를 동기화합니다.",
        "actionBadge": "URL 동기화"
        },
        {
        "step": 3,
        "title": "검색 결과 및 쿼리 파라미터 확인",
        "description": "서버 컴포넌트가 searchParams를 수신하여 필터링된 결과 3건을 반환합니다.",
        "actionBadge": "결과 확인",
        "observe": "URL 쿼리스트링 변경과 3단 검증 패널의 searchParams 실제 바인딩 값 대조",
        "observeAt": "verification"
        }
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
