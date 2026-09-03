import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/environment-variables/public-vs-server')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { EnvVariablesDemo } from './components/EnvVariablesDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"NEXT_PUBLIC_ 환경변수 vs 서버 전용 시크릿 분리"}
        concept={"NEXT_PUBLIC_ 접두사가 붙은 환경변수(NEXT_PUBLIC_API_URL)만 클라이언트 번들에 인라인 주입되고, 접두사가 없는 DB_PASSWORD/SECRET_KEY는 서버 런타임에만 격리 보관됩니다."}
        steps={[
          {
                    "step": 1,
                    "title": "클라이언트 공개 환경변수(NEXT_PUBLIC_API_URL) 점검 및 서버 전용 비밀 환경변수(DB_SECRET_KEY) 격리 상태 검사",
                    "description": "브라우저 번들에 인라인으로 번들링되어 노출이 허용된 공개 URL 값을 확인합니다. 클라이언트 코드에서 접근 시 undefined로 보호되는 서버 전용 시크릿을 점검합니다.",
                    "actionBadge": "공개 변수 확인"
          },
          {
                    "step": 2,
                    "title": "클라이언트 번들 분석을 통한 비밀키 노출 방지 관찰",
                    "description": "클라이언트 JS 파일에 민감한 데이터베이스 패스워드가 전혀 포함되지 않음을 검증합니다.",
                    "actionBadge": "격리 검증",
                    "observe": "NEXT_PUBLIC_ 변수의 클라이언트 렌더링 및 비접두사 서버 시크릿의 클라이언트 격리 상태 관찰",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"NEXT_PUBLIC_ vs 서버 환경변수 노출 범위 실습"}>
        <EnvVariablesDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
