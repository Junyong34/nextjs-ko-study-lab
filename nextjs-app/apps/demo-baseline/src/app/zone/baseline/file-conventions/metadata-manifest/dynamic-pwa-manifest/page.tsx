import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'file-conventions/metadata-manifest/dynamic-pwa-manifest')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { MetadataManifestDemo } from './components/MetadataManifestDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"manifest.ts 동적 PWA 웹 매니페스트"}
        concept={"app/manifest.ts에서 JSON 객체를 반환하여 테마 색상(#000000), PWA 앱 이름, 아이콘 목록을 브라우저에 제공하고 설치형 웹앱을 지원합니다."}
        steps={[
          {
                    "step": 1,
                    "title": "manifest.ts 메타데이터 객체 선언 확인 및 PWA 설치 설정값 점검",
                    "description": "name, short_name, theme_color, icons 배열이 정의된 TypeScript 매니페스트 구조를 확인합니다. display: 'standalone', start_url: '/' 등 웹앱 설치 환경을 위한 필수 속성을 점검합니다.",
                    "actionBadge": "manifest 선언"
          },
          {
                    "step": 2,
                    "title": "manifest.webmanifest JSON 응답 검증",
                    "description": "Next.js 런타임이 /manifest.webmanifest 경로로 올바른 JSON 헤더와 함께 응답하는지 검증합니다.",
                    "actionBadge": "응답 검증",
                    "observe": "3단 검증 패널에서 manifest.ts의 반환 객체와 PWA 명세 충족 여부 확인",
                    "observeAt": "verification"
          }
]}
        />
      <DemoPlaygroundCard title={"manifest.ts 동적 매니페스트 출력 실습"}>
        <MetadataManifestDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
