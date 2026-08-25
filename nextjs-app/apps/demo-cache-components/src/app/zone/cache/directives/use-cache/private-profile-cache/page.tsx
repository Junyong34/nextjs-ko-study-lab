import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DirectiveUseCachePrivateDemo } from './components/DirectiveUseCachePrivateDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"'use cache: private' 사용자 개인화 세션 캐시"}
        concept={"사용자 세션 쿠키에 기반한 개인화 프로필 및 최근 주문 내역을 'use cache: private'로 스코프를 한정하여 다른 사용자와 캐시가 공유되는 보안 사고를 방지합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "개인 프로필 캐시 스코프 점검 및 개인화 캐시 0ms 즉시 응답 확인",
                    "description": "쿠키/세션 헤더 기반의 사용자 식별자가 캐시 키에 포함되어 private 영역으로 격리되는 구조를 확인합니다. 해당 사용자의 반복 조회 시 민감 정보가 포함된 프로필 카드가 캐시에서 초고속 서빙되는지 점검합니다.",
                    "actionBadge": "private 스코프"
          },
          {
                    "step": 2,
                    "title": "사용자 간 캐시 오염 방지 검증",
                    "description": "다른 세션 ID로 요청 시 이전 사용자의 캐시 데이터가 노출되지 않고 독립 캐시가 생성되는지 검증합니다.",
                    "actionBadge": "보안 격리",
                    "observe": "3단 검증 패널에서 'use cache: private' 격리 사양과 사용자별 독립 캐시 동작 확인",
                    "observeAt": "verification"
          }
]}
        />
      <DemoPlaygroundCard title={"'use cache: private' 개인화 주문 내역 캐시 격리 실습"}>
        <DirectiveUseCachePrivateDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
