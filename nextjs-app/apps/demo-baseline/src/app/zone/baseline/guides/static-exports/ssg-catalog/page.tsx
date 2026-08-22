import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { SsgCatalogDemo } from './components/SsgCatalogDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"정적 HTML 카탈로그 사전 생성"}
        concept={"쇼핑몰 플랫폼의 실무 기능인 '정적 HTML 카탈로그 사전 생성' 구현을 위해 Next.js의 고급 가이드 아키텍처와 최적화 기법을 적용한 실습 예제입니다."}
        steps={[
          {
                    "step": 1,
                    "title": "쇼핑몰 시나리오 초기화",
                    "description": "이커머스 비즈니스 상태 및 카탈로그 데이터를 확인합니다.",
                    "actionBadge": "상태 로드"
          },
          {
                    "step": 2,
                    "title": "핵심 인터랙션 수행",
                    "description": "가이드에서 다루는 주요 기능(최적화/인증/캐시/스트리밍)을 실행합니다.",
                    "actionBadge": "실무 실습"
          },
          {
                    "step": 3,
                    "title": "성능 및 동작 검증",
                    "description": "네트워크 요청, 렌더링 수명 주기 및 상태 변화를 대조합니다.",
                    "actionBadge": "동작 검증"
          }
]}
      />
      <DemoPlaygroundCard title={"정적 HTML 카탈로그 사전 생성 실습"}>
        <SsgCatalogDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
