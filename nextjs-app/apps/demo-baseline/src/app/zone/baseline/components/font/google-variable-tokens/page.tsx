import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/font/google-variable-tokens')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FontGoogleVariableDemo } from './components/FontGoogleVariableDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"next/font/google 가변 폰트 및 CSS 변수 토큰"}
        concept={"next/font/google을 통해 구글 웹폰트를 빌드 시점에 셀프 호스팅하고 --font-inter CSS 변수로 주입하여 외부 네트워크 요청 0건과 폰트 CLS를 원천 제거합니다."}
        steps={[
        {
        "step": 1,
        "title": "[Inter], [Roboto], [Playfair Display] 폰트 버튼 선택",
        "description": "Google Fonts 프리셋 중 원하는 가변 폰트를 선택하여 실시간 전환합니다.",
        "actionBadge": "폰트 선택"
        },
        {
        "step": 2,
        "title": "빌드 타임 셀프 호스팅 점검",
        "description": "외부 Google Fonts 서버에 런타임 요청을 보내지 않고 자체 도메인에서 WOFF2 파일을 서빙하는지 점검합니다.",
        "actionBadge": "셀프 호스팅"
        },
        {
        "step": 3,
        "title": "무중단 폰트 렌더링 및 레이아웃 시프트 방지 확인",
        "description": "size-adjust가 자동 적용되어 폰트 로드 시 텍스트 떨림(CLS: 0)이 없는지 확인합니다.",
        "actionBadge": "CLS 0 검증",
        "observe": "3단 검증 패널에서 next/font/google의 CSS 변수 토큰 및 셀프 호스팅 사양 일치 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"Google Fonts 가변 폰트 CSS 변수 연동 실습"}>
        <FontGoogleVariableDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
