import React, { Suspense } from 'react'
import { cacheLife } from 'next/cache'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TimeBasedIsrClient } from './components/TimeBasedIsrClient'
import { VerificationFooter } from './components/VerificationFooter'

// 'use cache'와 cacheLife를 통한 시간 기반 캐시 함수
async function getTimeBasedCachedData() {
  'use cache'
  cacheLife({
    stale: 5,
    revalidate: 10,
    expire: 60,
  })

  const now = new Date()
  const timestamp = now.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  })
  const cacheId = Math.random().toString(36).substring(2, 8).toUpperCase()

  return {
    timestamp,
    cacheId,
  }
}

async function CachedContent() {
  const cached = await getTimeBasedCachedData()
  return (
    <TimeBasedIsrClient
      generatedTimestamp={cached.timestamp}
      cacheId={cached.cacheId}
    />
  )
}

export default function TimeBasedIsrDemoPage() {
  return (
    <DemoContainer className="space-y-6">
      {/* 1단. 상단 가이드 필드셋 */}
      <DemoGuideCard
        title="Next.js 16 `cacheLife` 시간 기반 캐시 수명 & SWR 재검증"
        concept="cacheLife({ revalidate: 10 })은 캐시가 생성된 지 10초 이내에는 즉각 캐시를 반환하고, 10초가 지나면 백그라운드에서 재검증(Stale-While-Revalidate)을 트리거하여 지속적으로 신선한 데이터를 유지합니다."
        steps={[
          {
            step: 1,
            title: '초기 캐시 ID 및 시각 확인',
            description: '현재 발급된 캐시 ID(#...)와 생성 시각을 확인합니다.',
            actionBadge: 'Fresh 캐시',
          },
          {
            step: 2,
            title: '10초 이내 새로고침',
            description: '경과 시간 10초 이전에 [새로고침]을 눌러 캐시 ID가 변하지 않음을 확인합니다.',
            actionBadge: '캐시 보존',
          },
          {
            step: 3,
            title: '10초 후 Stale 상태에서 새로고침',
            description: '10초 경과 후 [새로고침]을 눌러 백그라운드 재검증을 트리거합니다.',
            actionBadge: 'SWR 갱신',
          },
        ]}
      />

      {/* 2단. 실습 조작 영역 (DemoPlaygroundCard) */}
      <DemoPlaygroundCard title="시간 기반 캐시 수명 주기(SWR) 모니터" className="space-y-4">
        <Suspense
          fallback={
            <div className="p-4 text-center text-xs text-zinc-400 font-mono animate-pulse">
              [대기] 캐시 데이터 로딩 중...
            </div>
          }
        >
          <CachedContent />
        </Suspense>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter />
    </DemoContainer>
  )
}
