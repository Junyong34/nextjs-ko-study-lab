import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/output/standalone-container')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigOutputStandaloneDemo } from './components/ConfigOutputStandaloneDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="output: 'standalone' 도커 경량 컨테이너 패키징"
        concept="next.config.ts의 output: 'standalone' 설정을 통해 node_modules 의존성을 필요한 파일만 최소 추출하여 도커(Docker) 컨테이너 이미지를 80% 이상 경량화합니다."
        steps={[
          {
            step: 1,
            title: "[러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택",
            description: "standalone 산출물에 포함될 런타임 상품 모듈을 선택합니다.",
            actionBadge: "모듈 선택",
          },
          {
            step: 2,
            title: "[+] 수량 조절 후 [동작 실행] 클릭",
            description: "standalone 빌드 아티팩트의 런타임 실행 동작을 트리거합니다.",
            actionBadge: "산출물 실행",
          },
          {
            step: 3,
            title: "경량 컨테이너 산출물 크기 및 독립 구동 관찰",
            description: "외부 node_modules 전체 설치 없이 standalone 번들만으로 서버가 정상 구동되는지 실시간 로그에서 확인합니다.",
            actionBadge: "로그 검증",
            observe: "output: standalone 빌드 산출물 구조에 따라 경량화된 독립 서버 패키징이 검증됨",
            observeAt: "verification",
          },
        ]}
      />
      <DemoPlaygroundCard title={"output: 'standalone' 도커 경량 컨테이너 패키징 실습"}>
        <ConfigOutputStandaloneDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
