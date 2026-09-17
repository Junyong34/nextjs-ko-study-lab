import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { GnbNav } from './components/GnbNav'
import { VerificationFooter } from './components/VerificationFooter'

export default function UsePathnameActiveLinkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="usePathname() 기반 GNB 활성 메뉴 하이라이트"
        concept="usePathname()은 현재 브라우저 URL의 pathname을 반환하는 Client Component 전용 훅입니다. GNB의 각 <Link href>와 이 값을 비교해 일치하는 탭에만 활성 스타일을 입히므로, 하이라이트는 실제 라우팅 상태와 항상 정확히 동기화됩니다."
        steps={[
          {
            step: 1,
            title: '[신상품 (New)] 탭 클릭',
            description: '실제 <Link href="/new">를 클릭해 물리적으로 존재하는 서브 라우트로 이동합니다.',
            actionBadge: '실제 이동',
          },
          {
            step: 2,
            title: '[베스트 100], [기획전] 등 다른 탭으로 계속 이동',
            description: '여러 서브 라우트를 오가며 usePathname()이 반환하는 문자열이 클릭할 때마다 실시간으로 바뀌는지 확인합니다.',
            actionBadge: '경로 변경 관찰',
            observe: '인스펙터에 표시된 usePathname() 값이 방금 클릭한 탭의 href와 정확히 일치',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '하단 검증 패널에서 실제 라우팅 여부 확인',
            description: '직전 경로와 현재 경로를 비교해 usePathname()이 흉내가 아니라 실제 URL 변화에 반응했는지 검증합니다.',
            actionBadge: '검증 완료',
            observe: '탭을 이동할 때마다 이동 횟수가 증가하고, 직전 경로와 현재 경로 값이 서로 달라짐',
            observeAt: 'verification',
          },
        ]}
      />

      <DemoPlaygroundCard title="usePathname() 기반 GNB — 실제 서브 라우트(/new, /deals, /best, /events) 이동">
        <GnbNav />
        <div className="mt-3">{children}</div>
      </DemoPlaygroundCard>

      <VerificationFooter />
    </DemoContainer>
  )
}
