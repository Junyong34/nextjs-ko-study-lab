import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProbeProvider } from './components/ProbeContext'
import { RouteNav } from './components/RouteNav'
import { RequestProbe } from './components/RequestProbe'
import { VerificationFooter } from './components/VerificationFooter'
import { SAMPLES_PER_ROUTE } from './routes'

/**
 * 4단 레이아웃을 layout에 두어 하위 page(static/headers/search-params/connection) 사이를 이동해도
 * 가이드·실측 결과가 유지되게 한다. 이 layout 자체는 런타임 API를 호출하지 않는다 —
 * 호출하면 하위 page가 모두 ƒ가 되어 대조가 무너진다.
 */
export default function StaticAndDynamicLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="정적(Static) vs 동적(Dynamic) page.tsx 렌더링"
        concept="page.tsx는 기본적으로 빌드 때 한 번 렌더링되어 저장(○)됩니다. page 본문이 headers()·searchParams·connection() 같은 요청 시점 API를 쓰는 순간 그 라우트는 요청마다 렌더링(ƒ)됩니다."
        steps={[
          {
            step: 1,
            title: '하위 page 4개를 링크로 열어 보기',
            description: '각 page는 서버에서 실행된 시각과 렌더 ID를 그립니다. 같은 링크를 다시 누르거나 새로고침해 값이 바뀌는지 봅니다.',
            actionBadge: '실제 라우트',
          },
          {
            step: 2,
            title: `[각 page를 ${SAMPLES_PER_ROUTE}번씩 실제 요청] 클릭`,
            description: '브라우저가 4개 URL을 실제로 GET 요청해, 받은 HTML의 렌더 ID와 응답 헤더(x-nextjs-cache, cache-control)를 표로 비교합니다.',
            actionBadge: '실측',
            observe: 'production에서 static/만 렌더 ID가 1개로 고정되고, 나머지는 요청 수만큼 바뀜',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '검증 패널에서 실행 모드별 판정 확인',
            description: 'next dev에서는 네 page 모두 매번 렌더링되는 것이 기대값입니다. ○/ƒ 차이는 next build && next start에서 확인합니다.',
            actionBadge: '검증',
            observe: '실행 모드에 맞는 기대 렌더 ID 개수와 실측 개수가 모두 일치하면 검증 완료',
            observeAt: 'verification',
          },
        ]}
      />
      <ProbeProvider>
        <DemoPlaygroundCard title="같은 RenderStamp, 다른 런타임 API — 실제 하위 page 4개">
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
