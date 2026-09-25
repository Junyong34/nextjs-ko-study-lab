import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ProbeProvider } from './components/ProbeContext'
import { LangNav } from './components/LangNav'
import { DictionaryProbe } from './components/DictionaryProbe'
import { VerificationFooter } from './components/VerificationFooter'
import { ConceptCard } from './components/ConceptCard'

/**
 * 4단 레이아웃을 layout에 두어 언어 page 사이를 이동해도 가이드·실측 결과가 유지되게 한다.
 * 런타임 API(cookies, headers 등)를 호출하지 않는다 — 호출하면 [lang] page가 ●에서 ƒ로 바뀐다.
 */
export default function DictionaryTranslationLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="서버 컴포넌트에서 언어별 JSON 사전을 읽어 번역 렌더링"
        concept="경로의 [lang]을 받아 getDictionary(lang)가 그 언어의 JSON만 서버에서 import합니다. 브라우저는 번역이 끝난 HTML만 받으므로 사전이 JS 번들에 들어가지 않고, generateStaticParams로 언어별 HTML을 빌드 때 만들며(●), 사전이 없는 언어는 404가 됩니다."
        steps={[
          {
            step: 1,
            title: '/ko · /en · /ja 링크로 언어 page 열기',
            description: '같은 상품 카드가 각 언어 사전으로 서버에서 렌더링됩니다. 카드 하단에 불러온 사전 파일과 키 개수가 보입니다. /fr은 404 화면으로 이동합니다.',
            actionBadge: '실제 라우트',
          },
          {
            step: 2,
            title: '[사전·번들 실측 실행] 클릭',
            description: '브라우저가 세 언어의 page HTML과 사전 원본을 받아 대조하고, 각 page가 참조하는 JS 청크를 전부 내려받아 사전 문자열을 검색합니다.',
            actionBadge: '실측',
            observe: 'SSR HTML ↔ 사전 원본 6/6 일치, 청크 내 다른 언어 사전 문자열 0건, /fr 404',
            observeAt: 'playground',
          },
          {
            step: 3,
            title: '검증 패널에서 실행 모드별 판정 확인',
            description: 'next start에서는 언어 page에 x-nextjs-cache가 붙어 빌드 때 만든 HTML임을 함께 확인합니다.',
            actionBadge: '대조',
            observe: '모든 항목이 [O]이면 검증 완료',
            observeAt: 'verification',
          },
        ]}
      />
      <ProbeProvider>
        <DemoPlaygroundCard title="dictionary-translation/[lang]/page.tsx (●) — 서버 컴포넌트 + getDictionary(lang)">
          <div className="space-y-4">
            <LangNav />
            {children}
            <DictionaryProbe />
          </div>
        </DemoPlaygroundCard>
        <VerificationFooter />
      </ProbeProvider>
      <ConceptCard />
    </DemoContainer>
  )
}
