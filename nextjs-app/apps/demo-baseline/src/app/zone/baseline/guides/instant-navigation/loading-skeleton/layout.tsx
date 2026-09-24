import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { NavTimingProvider, MeasuredSlot } from './components/NavTimingProvider'
import { MeasuredNav } from './components/MeasuredNav'
import { TimingBoard } from './components/TimingBoard'
import { VerificationFooter } from './components/VerificationFooter'
import { SERVER_DELAY_MS } from './types'

/**
 * 공유 layout: 하위 경로(with-loading / without-loading)로 이동해도 리마운트되지 않으므로
 * 측정기(NavTimingProvider)와 링크·측정표가 전환 전후를 모두 관찰할 수 있다.
 */
export default function LoadingSkeletonLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavTimingProvider>
      <DemoContainer className="space-y-6">
        <DemoGuideCard
          title="Instant Navigation: loading.tsx로 클릭 직후 피드백 앞당기기"
          concept={`서버가 ${SERVER_DELAY_MS}ms를 실제로 기다리는 두 하위 page 중 loading.tsx가 있는 쪽만 클릭 즉시 스켈레톤을 보여줍니다. 전체 완료 시간은 같고 '첫 피드백' 시간이 달라집니다. production에서는 loading 경계까지 prefetch되어 더 빨라집니다.`}
          steps={[
            {
              step: 1,
              title: '[loading.tsx 없음 경로로 이동 →] 클릭',
              description: `이전 화면이 약 ${SERVER_DELAY_MS}ms 동안 그대로 남았다가 최종 카탈로그로 바뀌는지 봅니다.`,
              actionBadge: '경계 없음',
            },
            {
              step: 2,
              title: '[loading.tsx 있음 경로로 이동 →] 클릭',
              description: '클릭 직후 스켈레톤이 뜨고, 서버 대기가 끝나면 같은 자리에 최종 카탈로그가 채워지는지 봅니다.',
              actionBadge: '스켈레톤',
              observe: '측정표의 "클릭→첫 피드백"과 "클릭→최종" 두 열을 비교',
              observeAt: 'playground',
            },
            {
              step: 3,
              title: 'dev와 production에서 각각 반복',
              description: 'next dev와 next build 후 next start에서 첫 피드백 시간과 "클릭 전 prefetch" 건수·응답 크기가 어떻게 달라지는지 확인합니다.',
              actionBadge: 'dev vs prod',
              observe: '검증 패널의 판정과 실측 근거',
              observeAt: 'verification',
            },
          ]}
        />
        <DemoPlaygroundCard title="loading.tsx 유무 두 경로 실측 비교" className="min-w-0">
          <div className="space-y-4">
            <MeasuredNav />
            <TimingBoard />
            <MeasuredSlot>{children}</MeasuredSlot>
          </div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </DemoContainer>
    </NavTimingProvider>
  )
}
