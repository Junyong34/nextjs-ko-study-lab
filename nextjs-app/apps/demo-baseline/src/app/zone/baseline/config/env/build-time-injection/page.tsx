import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigEnvInjectionDemo } from './components/ConfigEnvInjectionDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"env 필드를 통한 빌드 타임 환경변수 주입"}
        concept={"쇼핑몰 엔터프라이즈 환경 설정을 위한 'env 필드를 통한 빌드 타임 환경변수 주입' 구성을 next.config.ts 및 아키텍처 레벨에서 실증하는 데모입니다."}
        steps={[
          {
                    "step": 1,
                    "title": "설정 프로파일 점검",
                    "description": "next.config.ts 또는 런타임 환경에 주입된 설정값을 확인합니다.",
                    "actionBadge": "설정 로드"
          },
          {
                    "step": 2,
                    "title": "요청 가로채기 및 라우팅 테스트",
                    "description": "설정에 정의된 규칙(헤더, 리다이렉트, 프록시 등)을 테스트합니다.",
                    "actionBadge": "규칙 테스트"
          },
          {
                    "step": 3,
                    "title": "보안 및 인프라 효과 검증",
                    "description": "응답 헤더, 도메인 보안, 빌드 산출물 격리를 종합 검증합니다.",
                    "actionBadge": "인프라 검증"
          }
]}
      />
      <DemoPlaygroundCard title={"env 필드를 통한 빌드 타임 환경변수 주입 실습"}>
        <ConfigEnvInjectionDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
