import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('cache', 'functions/unstable-cache/db-query')

import React, { Suspense } from 'react'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import { WorkbenchSection, WorkbenchSectionFallback } from './components/WorkbenchSection'
import { UnstableCacheDeepDive } from './components/UnstableCacheDeepDive'
import { REVALIDATE_SECONDS } from './tags'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="unstable_cache를 통한 DB 쿼리 결과 캐싱"
        concept={`unstable_cache(fn, keyParts, { tags, revalidate })는 "함수 소스 + keyParts + 인자"를 키로 DB 쿼리 결과를 저장합니다. 같은 키는 쿼리를 실행하지 않고, 태그 무효화나 ${REVALIDATE_SECONDS}초 경과 후에만 다시 실행합니다. Next.js 16에서는 'use cache'로 대체된 레거시 API입니다.`}
        steps={[
          {
            step: 1,
            title: '[조회]를 같은 카테고리로 두 번, 다른 카테고리로 한 번',
            description: '첫 호출은 MISS(쿼리 실행), 같은 인자 재호출은 HIT(카운터 그대로), 다른 인자는 별도 엔트리라 다시 MISS입니다.',
            actionBadge: '인자 기반 키',
          },
          {
            step: 2,
            title: '[가격 +1,000원] → [조회] → [updateTag] → [조회]',
            description: 'DB만 바꾸면 캐시는 옛 가격을 돌려주고, 태그를 무효화해야 쿼리가 재실행되어 새 가격이 보입니다.',
            actionBadge: 'tags',
          },
          {
            step: 3,
            title: `${REVALIDATE_SECONDS}초 대기 후 [조회] 두 번, 그리고 B의 [keyParts 누락] KRW·USD`,
            description: '만료 후 첫 호출은 STALE(옛 값 + 백그라운드 재실행), 다음 호출이 새 runId를 받습니다. keyParts를 빼면 다른 통화에도 같은 결과가 돌아옵니다.',
            actionBadge: 'revalidate · keyParts',
            observe: '검증 패널 5개 항목이 [관측됨]으로 바뀌고, 호출 기록의 runId·카운터가 근거로 표시됨',
            observeAt: 'verification',
          },
        ]}
      />
      <Suspense fallback={<WorkbenchSectionFallback />}>
        <WorkbenchSection />
      </Suspense>
      <UnstableCacheDeepDive />
    </DemoContainer>
  )
}
