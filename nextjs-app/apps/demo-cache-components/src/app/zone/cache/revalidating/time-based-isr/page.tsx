import React, { Suspense } from 'react'
import { cacheLife } from 'next/cache'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TimeBasedIsrClient } from './components/TimeBasedIsrClient'
import { VerificationFooter } from './components/VerificationFooter'

// 'use cache'와 cacheLife를 통한 시간 기반 캐시 함수
async function getTimeBasedCachedData() {
  'use cache'
  cacheLife({
    stale: 10,
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
        title="Next.js 16 cacheLife 시간 기반 캐시 수명 & SWR 재검증"
        concept="'use cache' 환경에서 cacheLife({ stale: 10, revalidate: 10, expire: 60 })를 선언하면 10초간 FRESH 캐시가 유지되고, stale 이후 요청 시 기존 캐시를 즉시 반환하면서 백그라운드에서 데이터를 갱신(SWR)합니다."
        steps={[
          {
            step: 1,
            title: '[브라우저 새로고침 (SWR 테스트)] 클릭 (0~10초)',
            description: '10초 이내에 버튼을 반복 클릭하여 캐시 시각이 변하지 않고 FRESH 상태를 유지하는 것을 확인합니다.',
            actionBadge: 'FRESH 캐시 히트',
          },
          {
            step: 2,
            title: '10초 경과 후 [브라우저 새로고침 (SWR 테스트)] 클릭',
            description: '10초 경과 후 요청하여 기존 캐시를 즉시 반환받고 백그라운드에서 새 캐시가 생성되는 STALE 동작을 확인합니다.',
            actionBadge: 'SWR 백그라운드 갱신',
          },
          {
            step: 3,
            title: '갱신된 새 캐시 타임스탬프 관찰',
            description: '한 번 더 버튼을 클릭하여 백그라운드에서 갱신 완료된 최신 타임스탬프로 교체된 데이터를 관찰합니다.',
            actionBadge: '최신 캐시 수신',
            observe: '10초 경과 후 SWR 백그라운드 갱신이 완료되어 캐시 타임스탬프와 생성 카운트가 최신 값으로 전환됨',
            observeAt: 'playground',
          },
        ]}
      />

      {/* 2단, 3단, 4단: 실습 조작 영역 및 검증/개념정리 */}
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-zinc-400 font-mono animate-pulse">
            [대기] 캐시 데이터 로딩 중...
          </div>
        }
      >
        <CachedContent />
      </Suspense>
    </DemoContainer>
  )
}
