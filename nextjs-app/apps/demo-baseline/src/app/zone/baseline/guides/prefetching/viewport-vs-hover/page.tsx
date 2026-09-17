'use client'
import React, { useCallback, useState } from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { PrefetchModesDemo } from './components/PrefetchModesDemo'
import { VerificationFooter } from './components/VerificationFooter'
import type { PrefetchCounts } from './types'

const INITIAL_COUNTS: PrefetchCounts = { autoCount: 0, disabledCount: 0 }

export default function DemoPage() {
  const [counts, setCounts] = useState<PrefetchCounts>(INITIAL_COUNTS)
  const isDev = process.env.NODE_ENV !== 'production'

  const handleObserve = useCallback((next: PrefetchCounts) => {
    setCounts(next)
  }, [])

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="뷰포트 진입 시 자동 prefetch와 prefetch={false} 비교"
        concept="prefetch prop을 지정하지 않은 기본 <Link>는 뷰포트에 들어오는 즉시 Next.js가 자동으로 prefetch 요청을 보냅니다. prefetch={false}는 이 자동 요청을 완전히 차단하며, 호버해도 대신 요청을 보내지 않습니다 — 실제 요청은 클릭해서 이동할 때만 발생합니다."
        steps={[
          {
            step: 1,
            title: '페이지 진입 직후 두 링크의 실제 요청 건수 확인',
            description:
              '아래 실습 화면의 두 카드에 표시된 "실제 관찰된 prefetch 요청" 수치를 확인합니다. production 모드에서는 기본 링크만 1건 이상 올라갑니다.',
            actionBadge: '초기 상태 확인',
            observe: '기본 링크(파란색)와 prefetch={false} 링크(주황색)의 요청 건수 차이',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[prefetch={false}] 링크에 마우스 호버',
            description:
              '호버해도 요청 건수가 계속 0건으로 유지되는지 확인합니다. prefetch={false}는 뷰포트 진입은 물론 호버 시점에도 요청을 보내지 않습니다.',
            actionBadge: '호버 테스트',
          },
          {
            step: 3,
            title: '개발 모드와 production 모드 차이 확인',
            description:
              '지금이 development 모드라면 기본 링크도 0건이 정상입니다. pnpm build && pnpm start로 실행하면 기본 링크에서만 요청이 관찰됩니다.',
            actionBadge: '모드별 차이 확인',
            observe: '3단 검증 패널의 Expected/Actual과 현재 실행 모드 표시',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="뷰포트 진입 시 자동 prefetch와 prefetch={false} 비교 실습">
        <div className="mb-3 flex justify-end">
          <DemoResetButton label="관찰 초기화 (새로고침)" />
        </div>
        <PrefetchModesDemo isDev={isDev} onObserve={handleObserve} />
      </DemoPlaygroundCard>

      <VerificationFooter counts={counts} isDev={isDev} />
    </DemoContainer>
  )
}
