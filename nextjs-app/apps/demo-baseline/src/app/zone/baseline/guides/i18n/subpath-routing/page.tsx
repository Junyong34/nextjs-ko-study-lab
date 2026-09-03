import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/i18n/subpath-routing')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { I18nSubpathDemo } from './components/I18nSubpathDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"다국어 서브패스 라우팅(/[lang]/shop) 및 Accept-Language 감지"}
        concept={"미들웨어에서 브라우저 Accept-Language 헤더를 감지하여 적절한 언어 서브패스(/ko, /en, /ja)로 307 리다이렉트하고, /[lang] 동적 세그먼트를 통해 현지화된 페이지를 제공합니다."}
        steps={[
          {
            step: 1,
            title: "기본 한국어 경로([/ko/shop]) 활성화 상태 확인",
            description: "현재 서브패스 세그먼트가 ko로 지정된 카탈로그 페이지 상태를 확인합니다.",
            actionBadge: "현재 언어 점검",
          },
          {
            step: 2,
            title: "[/en/shop] 또는 [/ja/shop] 언어 전환 버튼 클릭",
            description: "글로벌 서브패스로 이동하여 다국어 라우트 세그먼트 전환을 실행합니다.",
            actionBadge: "언어 서브패스 전환",
          },
          {
            step: 3,
            title: "URL 서브패스 변경 및 현지화된 라우팅 구조 관찰",
            description: "페이지 새로고침 없이 Next.js 라우터가 언어별 세그먼트로 매끄럽게 전이되는지 검증합니다.",
            actionBadge: "라우팅 검증",
            observe: "버튼 클릭에 따른 언어 서브패스(/ko ↔ /en ↔ /ja) 전환 및 활성 스타일 적용 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"/[lang]/products 다국어 서브패스 라우팅 실습"}>
        <I18nSubpathDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
