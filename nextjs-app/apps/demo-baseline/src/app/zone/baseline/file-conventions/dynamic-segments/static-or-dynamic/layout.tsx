import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProbeProvider } from './components/ProbeContext'
import { RouteNav } from './components/RouteNav'
import { RequestProbe } from './components/RequestProbe'
import { VerificationFooter } from './components/VerificationFooter'
import { SAMPLES_PER_ROUTE } from './routes'

/**
 * 4단 레이아웃을 layout에 두어 하위 라우트 사이를 이동해도 가이드·실측 결과가 유지되게 한다.
 * 이 layout 자체는 런타임 API를 호출하지 않는다 — 호출하면 하위 라우트가 모두 ƒ가 되어 대조가 무너진다.
 */
export default function StaticOrDynamicLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="[slug] 세그먼트의 정적·동적 렌더링 판정"
        concept="[slug]가 있다고 항상 동적인 것은 아니고, 없다고 항상 정적인 것도 아닙니다. generateStaticParams 유무와 본문의 런타임 API에 따라 ƒ(요청마다) · ●(빌드 때 생성) · 첫 요청 뒤 재사용으로 갈립니다."
        steps={[
          {
            step: 1,
            title: '하위 라우트 4개를 링크로 열어 보기',
            description: '각 라우트는 params.slug와 서버 렌더 ID를 그립니다. 같은 링크를 다시 누르거나 새로고침해 값이 바뀌는지 봅니다.',
            actionBadge: '실제 라우트',
          },
          {
            step: 2,
            title: `[각 라우트를 ${SAMPLES_PER_ROUTE}번씩 실제 요청] 클릭`,
            description: '브라우저가 4개 URL을 실제로 GET 요청해, 받은 HTML의 렌더 ID와 응답 헤더를 표로 비교합니다.',
            actionBadge: '실측',
            observe: 'production에서 no-gsp·with-headers만 렌더 ID가 요청 수만큼 바뀌고, with-gsp는 목록 안팎 모두 1개로 고정됨',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '검증 패널에서 실행 모드별 판정 확인',
            description: 'next dev에서는 4개 모두 매번 렌더링되는 것이 기대값입니다. ƒ/● 차이는 next build && next start에서 확인합니다.',
            actionBadge: '검증',
            observe: '실행 모드에 맞는 기대 렌더 ID 개수와 실측 개수가 모두 일치하면 검증 완료',
            observeAt: 'verification',
          },
        ]}
      />
      <ProbeProvider>
        <DemoPlaygroundCard title="같은 RenderStamp, 다른 [slug] 조건 — 실제 하위 라우트 4개">
          <div className="space-y-4">
            <RouteNav />
            {children}
            <RequestProbe />
          </div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </ProbeProvider>
    </DemoContainer>
  )
}
