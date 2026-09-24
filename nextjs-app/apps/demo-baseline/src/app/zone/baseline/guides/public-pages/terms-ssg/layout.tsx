import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProbeProvider } from './components/ProbeContext'
import { TermsNav } from './components/TermsNav'
import { RequestProbe } from './components/RequestProbe'
import { VerificationFooter } from './components/VerificationFooter'
import { SAMPLES_PER_TARGET } from './terms'

/**
 * 4단 레이아웃을 layout에 두어 약관 하위 page 사이를 이동해도 가이드·실측 결과가 유지되게 한다.
 * 이 layout은 런타임 API를 호출하지 않는다 — 호출하면 documents/ 하위가 모두 ƒ가 되어 대조가 무너진다.
 */
export default function TermsSsgLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="이용약관 버전·언어별 정적 페이지 사전 생성"
        concept="약관은 누가 보든 같은 내용입니다. generateStaticParams로 존재하는 (언어, 버전)을 전부 알려주면 next build가 문서마다 HTML을 만들어 두고(●), 목록 밖 버전은 dynamicParams=false로 404가 됩니다. 저장된 HTML은 CDN이 캐시할 수 있는 헤더로 나갑니다."
        steps={[
          {
            step: 1,
            title: '약관 링크를 눌러 문서 열기',
            description: '각 문서 아래에 서버 렌더 시각과 렌더 ID가 보입니다. 새로고침해도 값이 그대로인지 봅니다. 목록 밖 버전 링크는 404 화면으로 이동합니다.',
            actionBadge: '실제 라우트',
          },
          {
            step: 2,
            title: `[약관 URL을 ${SAMPLES_PER_TARGET}번씩 실제 요청] 클릭`,
            description: '브라우저가 6개 URL을 실제로 GET 요청해 상태 코드, 렌더 ID·시각, x-nextjs-cache, cache-control을 표로 비교합니다.',
            actionBadge: '실측',
            observe: 'production에서 documents/ 3개는 렌더 ID 1개·빌드 시각 고정·s-maxage, 목록 밖 2개는 404, with-cookies/는 요청마다 새 ID',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '[v2026-03에 동의] 후 두 라우트 비교',
            description: 'documents/는 브라우저에서 쿠키를 읽어 ●를 유지하고, with-cookies/는 서버에서 cookies()로 읽어 ƒ가 됩니다.',
            actionBadge: '대조',
            observe: '검증 패널에서 실행 모드별 기대값과 실측값이 모두 일치하면 검증 완료',
            observeAt: 'verification',
          },
        ]}
      />
      <ProbeProvider>
        <DemoPlaygroundCard title="documents/[lang]/[version] (●) · with-cookies/[version] (ƒ) — 실제 하위 page">
          <div className="space-y-4">
            <TermsNav />
            {children}
            <RequestProbe />
          </div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </ProbeProvider>
    </DemoContainer>
  )
}
