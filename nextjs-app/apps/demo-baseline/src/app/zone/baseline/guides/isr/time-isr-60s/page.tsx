import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/isr/time-isr-60s')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { TimeIsrDemo } from './components/TimeIsrDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"시간 기반 ISR(revalidate = 60) 점진적 정적 재생성"}
        concept={"export const revalidate = 60 설정을 통해 페이지를 정적 HTML로 빌드한 후, 60초 캐시 주기 만료 시 첫 방문자의 백그라운드 재생성을 통해 서버 부하 없이 최신 콘텐츠를 유지합니다."}
        steps={[
          {
            step: 1,
            title: "현재 정적 생성 빌드 타임스탬프 확인",
            description: "60초 ISR 주기가 적용된 정적 카탈로그의 최초 생성 시각과 캐시 TTL 상태를 점검합니다.",
            actionBadge: "정적 타임스탬프",
          },
          {
            step: 2,
            title: "[60초 경과 시뮬레이션 및 새로고침] 클릭",
            description: "60초 TTL 만료 후 페이지 요청 시 기존 캐시를 즉시 서빙하고 백그라운드 빌드가 트리거되는 과정을 실행합니다.",
            actionBadge: "ISR 트리거",
          },
          {
            step: 3,
            title: "백그라운드 재생성 완료 후 갱신된 타임스탬프 관찰",
            description: "두 번째 새로고침에서 새로 빌드된 최신 정적 HTML 타임스탬프로 교체되는 ISR 수명 주기를 검증합니다.",
            actionBadge: "재생성 검증",
            observe: "60초 만료 후 백그라운드 재생성 완료에 따른 정적 HTML 타임스탬프 갱신 결과 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"60초 주기 상품 상세 증분 정적 재생성 (ISR) 실습"}>
        <TimeIsrDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
