import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProbeProvider } from './components/ProbeContext'
import { LocaleNav } from './components/LocaleNav'
import { ProbeControls } from './components/ProbeControls'
import { VerificationFooter } from './components/VerificationFooter'
import { ConceptCard } from './components/ConceptCard'

/** 4단을 layout에 두어 언어 page 사이를 이동해도 가이드와 실측 결과가 유지되게 한다. */
export default function SubpathRoutingLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="/[lang]/products 서브패스 라우팅"
        concept="URL의 첫 세그먼트 [lang]이 언어를 정합니다. 페이지는 await params로 lang을 받아 서버에서 그 언어로 렌더링하고, 지원하지 않는 언어는 notFound()로 404가 됩니다."
        steps={[
          {
            step: 1,
            title: '/ko · /en · /ja 링크를 차례로 클릭',
            description: '실제 [lang] 경로로 이동합니다. 같은 상품 목록의 문자열·통화가 언어별로 바뀌고 URL의 [lang] 세그먼트도 함께 바뀝니다. 상품명을 눌러 /[lang]/products/[id]로도 이동해 보세요.',
            actionBadge: '실제 라우트',
            observe: '현재 URL 경로와 [lang] 세그먼트, 상품 목록 언어',
            observeAt: 'playground',
          },
          {
            step: 2,
            title: '[경로 실측 실행] 클릭',
            description: '브라우저가 /ko·/en·/ja·/fr의 /products를 실제로 요청해 HTTP 상태와 서버 렌더링 HTML을 읽습니다.',
            actionBadge: '실측',
            observe: '/ko·/en·/ja는 200, /fr은 404',
            observeAt: 'network',
          },
          {
            step: 3,
            title: '검증 패널 확인 후 /fr 링크 클릭',
            description: '모든 항목이 [O]이면 검증 완료입니다. /fr 링크를 누르면 notFound() 결과인 404 화면을 직접 볼 수 있습니다.',
            actionBadge: '404 확인',
            observe: '모든 항목 [O] → 검증 완료',
            observeAt: 'verification',
          },
        ]}
      />
      <ProbeProvider>
        <DemoPlaygroundCard title="subpath-routing/[lang]/products/page.tsx — params.lang으로 서버 렌더링">
          <div className="space-y-4">
            <LocaleNav />
            <div className="min-h-[120px] rounded-md border border-zinc-200 p-3 dark:border-zinc-800">{children}</div>
            <ProbeControls />
          </div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </ProbeProvider>
      <ConceptCard />
    </DemoContainer>
  )
}
