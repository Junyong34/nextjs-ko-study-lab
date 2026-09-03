import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/metadata-robots/dynamic-crawler-rules')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MetadataRobotsDemo } from './components/MetadataRobotsDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"robots.ts 동적 크롤러 색인 규칙"}
        concept={"app/robots.ts에서 검색엔진 봇별(Googlebot, Yeti) Allow/Disallow 경로와 Sitemap URL을 동적으로 분기하여 SEO 크롤링을 최적화합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "robots.ts rules 객체 선언 확인 및 사이트맵 URL 연동 점검",
                    "description": "User-Agent별 허용 경로(/)와 차단 경로(/admin, /api)가 정의된 구조를 확인합니다. sitemap 속성에 정확한 사이트맵 절대 경로가 지정되어 있는지 점검합니다.",
                    "actionBadge": "규칙 확인"
          },
          {
                    "step": 2,
                    "title": "robots.txt 텍스트 포맷 변환 검증",
                    "description": "Next.js가 /robots.txt 요청에 대해 표준 robots.txt 포맷 텍스트로 응답하는지 검증합니다.",
                    "actionBadge": "포맷 검증",
                    "observe": "3단 검증 패널에서 robots.ts의 크롤러 규칙과 사이트맵 경로 매핑 상태 확인",
                    "observeAt": "verification"
          }
]}
        />
      <DemoPlaygroundCard title={"robots.ts 동적 크롤링 규칙 생성 실습"}>
        <MetadataRobotsDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
