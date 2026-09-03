import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/cross-origin/anonymous-mode')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigCrossOriginDemo } from './components/ConfigCrossOriginDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="crossOrigin: 'anonymous' 서드파티 스크립트 속성"
        concept="next.config.ts의 crossOrigin: 'anonymous' 설정을 통해 생성되는 모든 <script> 및 <link> 태그에 crossorigin='anonymous' 속성을 부여하여 CORS 에러 로깅을 지원합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "CORS 스크립트 속성을 테스트할 상품 컴포넌트를 선택합니다.",
            actionBadge: "상품 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "crossOrigin 속성이 부여된 외부 스크립트 로딩 파이프라인을 호출합니다.",
            actionBadge: "스크립트 로드",
          },
          {
            step: 3,
            title: "HTML script 태그의 crossorigin 속성 주입 관찰",
            description: "스크립트 태그에 anonymous 속성이 자동 적용되어 CORS 에러 상세 추적이 가능한지 확인합니다.",
            actionBadge: "로그 검증",
            observe: "생성된 스크립트 태그에 crossorigin=\"anonymous\" 속성이 정상 주입되어 로깅됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"crossOrigin: 'anonymous' 서드파티 스크립트 속성 실습"}>
        <ConfigCrossOriginDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
