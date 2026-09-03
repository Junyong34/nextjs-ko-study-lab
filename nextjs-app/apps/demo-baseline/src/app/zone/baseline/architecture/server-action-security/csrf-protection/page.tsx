import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'architecture/server-action-security/csrf-protection')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ArchServerActionCsrfDemo } from './components/ArchServerActionCsrfDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="Server Actions 자동 CSRF Origin 헤더 검증"
        concept="Next.js App Router는 Server Action HTTP POST 요청 수신 시 Origin 헤더와 Host 헤더의 일치 여부를 자동 비교 검증하여 외부 사이트로부터의 CSRF 공격을 100% 원천 차단합니다."
        steps={[
          {
                    "step": 1,
                    "title": "Server Action 자동 CSRF 방어 메커니즘 점검 및 next.config.ts allowedOrigins 도메인 허용 설정 검토",
                    "description": "Next.js가 내부적으로 Origin 헤더와 Host 헤더를 대조하는 보안 파이프라인 명세를 확인합니다. 서브도메인이나 모바일 앱 도메인을 위한 serverActions.allowedOrigins 설정을 확인합니다.",
                    "actionBadge": "보안 스펙 점검"
          },
          {
                    "step": 2,
                    "title": "불일치 Origin 요청에 대한 403 차단 동작 관찰",
                    "description": "위조된 Origin 헤더를 가진 악성 POST 요청이 서버 컴포넌트 실행 전 즉시 거부되는지 확인합니다.",
                    "actionBadge": "보안 검증",
                    "observe": "Server Action 요청 시 Origin/Host 헤더 자동 검증으로 CSRF 공격이 원천 차단됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"Server Actions 자동 CSRF Origin 헤더 검증 실습"}>
        <ArchServerActionCsrfDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
