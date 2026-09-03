import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'components/font/local-font-face')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { FontLocalFontFaceDemo } from './components/FontLocalFontFaceDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"next/font/local 커스텀 로컬 폰트 및 가중치 매핑"}
        concept={"next/font/local로 로컬 WOFF2 폰트 파일을 등록하고 variable 폰트 가중치(w100~w900)를 CSS 변수로 주입하여 무중단 폰트 렌더링을 구현합니다."}
        steps={[
        {
        "step": 1,
        "title": "[pretendard] 또는 [toss-face] 로컬 폰트 선택",
        "description": "public/fonts에 위치한 WOFF2 파일이 next/font/local 객체로 로드되는 경로를 확인합니다.",
        "actionBadge": "로컬 폰트"
        },
        {
        "step": 2,
        "title": "[w400], [w600], [w700] 가중치 버튼 클릭",
        "description": "가중치 버튼을 클릭하여 CSS font-weight 변화를 테스트합니다.",
        "actionBadge": "가중치 변경"
        },
        {
        "step": 3,
        "title": "로컬 폰트 렌더링 및 다운로드 최적화 확인",
        "description": "브라우저가 로컬 최적화 폰트를 사용하여 번들 누수 없이 고속 렌더링하는지 확인합니다.",
        "actionBadge": "렌더링 검증",
        "observe": "3단 검증 패널에서 next/font/local 폰트 페이스 매핑과 CSS 가중치 적용 상태 확인",
        "observeAt": "verification"
        }
        ]}
        />
      <DemoPlaygroundCard title={"next/font/local 커스텀 로컬 폰트 매핑 실습"}>
        <FontLocalFontFaceDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
