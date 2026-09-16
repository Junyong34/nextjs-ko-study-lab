import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'functions/use-search-params/debounce-transition')

import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { DebouncedSearchWorkspace } from './components/DebouncedSearchWorkspace'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="useTransition 연동 디바운스 검색 쿼리 동기화"
        concept="검색창에 연속으로 타이핑하는 동안 로컬 입력은 즉시 반영하고, 300ms 디바운스 후 startTransition으로 감싼 router.replace()만 실제 URL 쿼리를 갱신합니다."
        steps={[
          {
            step: 1,
            title: '[상품명을 입력하세요 (예: 키보드, 헤드폰, 데님)] 검색창에 연속 타이핑',
            description: '입력할 때마다 로컬 입력값과 키 입력 타임스탬프가 즉시 실습 화면에 기록됩니다.',
            actionBadge: '키보드 입력',
          },
          {
            step: 2,
            title: '타이핑을 멈추고 300ms 대기',
            description: '이전 디바운스 타이머가 취소되고 새 타이머가 걸리며, 정확히 300ms 뒤 startTransition 콜백이 router.replace()를 호출합니다.',
            actionBadge: '디바운스 커밋',
          },
          {
            step: 3,
            title: '주소창 쿼리(?q=)와 isPending 전환, 검증 패널 확인',
            description: '주소창의 쿼리 문자열이 실제로 바뀌고 isPending이 true→false로 전환되는 실측 로그를 확인합니다.',
            actionBadge: '결과 검증',
            observe: '커밋 지연이 300ms 기준을 실제로 충족하고 useSearchParams().get(\'q\')가 커밋된 검색어와 일치함',
            observeAt: 'verification',
          },
        ]}
      />
      <Suspense fallback={<div className="text-xs text-zinc-400">로딩 중...</div>}>
        <DebouncedSearchWorkspace />
      </Suspense>
    </DemoContainer>
  )
}
