import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/mdx-components/global-mdx-theme')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MdxGlobalThemeDemo } from './components/MdxGlobalThemeDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"mdx-components.tsx 글로벌 MDX 컴포넌트 매핑"}
        concept={"루트의 mdx-components.tsx에서 h1, p, code 등 마크다운 기본 태그를 쇼핑몰 디자인 시스템 커스텀 React DOM 컴포넌트로 전역 바인딩합니다."}
        steps={[
        {
        "step": 1,
        "title": "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
        "description": "MDX 컴포넌트 매핑을 테스트할 기본 상품 항목을 선택합니다.",
        "actionBadge": "상품 선택"
        },
        {
        "step": 2,
        "title": "[+] 수량 조절 후 [동작 실행] 클릭",
        "description": "MDX 렌더러에 동적 인터랙션 데이터를 전달합니다.",
        "actionBadge": "동작 실행"
        },
        {
        "step": 3,
        "title": "커스텀 MDX 컴포넌트 스타일 적용 확인",
        "description": "마크다운 콘텐츠가 mdx-components.tsx에 정의된 스타일과 UI 컴포넌트로 변환되어 렌더링되는지 확인합니다.",
        "actionBadge": "MDX 검증",
        "observe": "3단 검증 패널에서 커스텀 mdx-components 매핑이 정상 동작하는지 대조",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"글로벌 MDX 스타일 매핑 (mdx-components.tsx) 실습"}>
        <MdxGlobalThemeDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
