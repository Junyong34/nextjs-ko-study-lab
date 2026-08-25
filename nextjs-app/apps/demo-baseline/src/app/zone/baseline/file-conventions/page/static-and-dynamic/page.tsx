import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { StaticDynamicPageDemo } from './components/StaticDynamicPageDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"정적(Static SSG) vs 동적(Dynamic SSR) page.tsx 렌더링"}
        concept={"빌드 타임에 사전 생성되는 정적 페이지(Static 0ms)와 요청 시마다 서버에서 렌더링되는 동적 페이지(Dynamic force-dynamic)의 렌더링 파이프라인 차이를 대조합니다."}
        steps={[
        {
        "step": 1,
        "title": "정적 렌더링(SSG) 사양 확인",
        "description": "캐시 가능한 데이터 페칭과 정적 page.tsx가 빌드 타임에 HTML로 고정되는 원리를 확인합니다.",
        "actionBadge": "SSG 정적"
        },
        {
        "step": 2,
        "title": "동적 렌더링(SSR) 사양 확인",
        "description": "cookies()나 dynamic='force-dynamic'이 선언된 page.tsx가 매 요청마다 서버에서 실행되는 메커니즘을 점검합니다.",
        "actionBadge": "SSR 동적"
        },
        {
        "step": 3,
        "title": "렌더링 모드별 응답 헤더 및 결과 대조",
        "description": "정적 캐시 HIT와 동적 MISS 간의 성능 및 실시간성 트레이드오프를 확인합니다.",
        "actionBadge": "결과 대조",
        "observe": "3단 검증 패널에서 정적/동적 렌더링 방식의 차이점과 응답 사양이 올바르게 표시되는지 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"정적(Static) vs 동적(Dynamic) page.tsx 렌더링 실습"}>
        <StaticDynamicPageDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
