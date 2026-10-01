import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProbeProvider } from './components/ProbeContext'
import { TenantNav } from './components/TenantNav'
import { ProbeControls } from './components/ProbeControls'
import { VerificationFooter } from './components/VerificationFooter'
import { ConceptCard } from './components/ConceptCard'

/** 4단을 layout 에 두어 테넌트 page 사이를 이동해도 가이드와 실측 결과가 유지되게 한다. */
export default function IsolatedBrandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="/[tenant] 세그먼트와 CSS 변수로 테넌트별 브랜딩 주입"
        concept="서버 컴포넌트가 [tenant] 세그먼트로 테넌트 설정을 조회해 래퍼 요소에 CSS 변수를 주입하고, generateMetadata 로 title 까지 테넌트별로 만듭니다. 한 테넌트의 설정이 다른 테넌트의 응답에 섞이지 않는지 실제 응답으로 확인합니다."
        steps={[
          {
            step: 1,
            title: '/acme · /globex · /initech 링크를 차례로 클릭',
            description: '실제 [tenant] 경로로 이동합니다. 로고 모양과 버튼·견본 색, 브라우저 탭 제목이 테넌트마다 바뀝니다.',
            actionBadge: '실제 라우트',
            observe: '로고·색상·탭 제목, URL 의 [tenant] 세그먼트',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[테넌트 실측 실행] 클릭',
            description: '브라우저가 네 경로를 실제로 요청해 응답 HTML 의 CSS 변수·title·로고를 읽고, 다른 테넌트 값이 섞였는지 검사합니다.',
            actionBadge: '실측',
            observe: '/umbrella 는 404, 나머지는 200',
            observeAt: 'network',
          },
          {
            step: 3,
            title: '검증 패널 확인 후 /umbrella 링크 클릭',
            description: '모든 항목이 [O] 이면 검증 완료입니다. /umbrella 는 등록되지 않아 notFound() 결과인 404 화면이 보입니다.',
            actionBadge: '404 확인',
            observe: '모든 항목 [O] → 검증 완료',
            observeAt: 'verification',
          },
        ]}
      />
      <ProbeProvider>
        <DemoPlaygroundCard title="isolated-branding/[tenant]/layout.tsx — CSS 변수 주입과 generateMetadata">
          <div className="space-y-4">
            <TenantNav />
            <div className="min-h-[120px]">{children}</div>
            <ProbeControls />
          </div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </ProbeProvider>
      <ConceptCard />
    </DemoContainer>
  )
}
