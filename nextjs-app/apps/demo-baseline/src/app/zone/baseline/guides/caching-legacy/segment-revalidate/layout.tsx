import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProbeProvider } from './components/ProbeContext'
import { RouteNav } from './components/RouteNav'
import { RequestTimeline } from './components/RequestTimeline'
import { VerificationFooter } from './components/VerificationFooter'

/**
 * 4단 레이아웃을 layout에 두어 하위 page(isr-10s/static) 사이를 이동해도 실측 기록이 유지되게 한다.
 * 이 layout에는 revalidate를 선언하지 않는다 — 한 라우트의 layout·page 중 가장 짧은 revalidate가
 * 라우트 전체 주기가 되므로, 여기에 값을 두면 static/ 대조군까지 같은 주기로 재생성된다.
 */
export default function SegmentRevalidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="Route Segment revalidate로 만드는 시간 기반 ISR"
        concept="page에 export const revalidate = 10을 두면 빌드 때 만든 결과를 10초 동안 그대로 내보내고, 그 뒤 첫 요청에는 옛 결과를 즉시 준 채 백그라운드에서 다시 만들어 다음 요청부터 교체합니다."
        steps={[
          {
            step: 1,
            title: '[자동 관측] 클릭',
            description:
              '브라우저가 isr-10s/를 2초 간격으로 14번, static/을 앞뒤로 1번씩 실제 GET 요청해 렌더 ID와 응답 헤더를 기록합니다.',
            actionBadge: '실측',
          },
          {
            step: 2,
            title: '타임라인에서 HIT → STALE → 교체 흐름 읽기',
            description:
              '같은 ID가 HIT로 이어지다가, 렌더 후 10초를 넘긴 첫 응답이 STALE(옛 ID)로 오고, 바로 다음 응답에서 ID가 바뀌는지 봅니다.',
            actionBadge: '관찰',
            observe: 'STALE 행의 ID는 직전과 같고, 다음 행에 (교체) 표시가 붙음. static/은 ID가 그대로',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '검증 패널에서 실행 모드별 판정 확인',
            description:
              'next dev에서는 캐시가 없어 매 요청 새 ID가 기대값입니다. 시간 기반 재생성은 next build && next start에서 확인합니다.',
            actionBadge: '검증',
            observe: '실행 모드에 맞는 기대 흐름과 실측 기록이 일치하면 검증 완료',
            observeAt: 'verification',
          },
        ]}
      />
      <ProbeProvider>
        <DemoPlaygroundCard title="revalidate = 10 page vs revalidate 미지정 page — 실제 하위 page 2개">
          <div className="space-y-4">
            <RouteNav />
            {children}
            <RequestTimeline />
          </div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </ProbeProvider>
    </DemoContainer>
  )
}
