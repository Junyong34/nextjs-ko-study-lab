import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'guides/draft-mode/bypass-cookie')

import React from 'react'
import { draftMode } from 'next/headers'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { DraftBypassDemo } from './components/DraftBypassDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default async function DemoPage() {
  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title={"Draft Mode 바이패스 쿠키 발급 및 보안 검증"}
        concept={"draftMode().enable() 실행 시 서명된 __prerender_bypass 쿠키가 브라우저에 저장되어, 이후 발생하는 모든 페이지 요청이 0ms 빌드 시점 정적 HTML 대신 실시간 초안 렌더링으로 라우팅됩니다."}
        steps={[
          {
            step: 1,
            title: "VIP 시크릿 특가전 상품 상세 정적 캐시 뷰 확인",
            description: "바이패스 쿠키가 없을 때 일반 캐시 서버에서 반환된 공개 상품 스펙을 확인합니다.",
            actionBadge: "정적 캐시 확인",
          },
          {
            step: 2,
            title: "Draft Mode 활성화 토글 클릭",
            description: "__prerender_bypass 쿠키를 브라우저에 설정하고 실시간 초안 데이터를 요청합니다.",
            actionBadge: "바이패스 쿠키 활성화",
          },
          {
            step: 3,
            title: "서명된 바이패스 쿠키 감지 및 CMS 미발행 데이터 로드 관찰",
            description: "정적 캐시를 안전하게 우회하여 최신 드래프트 가격과 비공개 설명문이 렌더링되는지 검증합니다.",
            actionBadge: "바이패스 검증",
            observe: "Bypass 쿠키 활성화에 따른 정적 캐시 우회 및 VIP 시크릿 특가전 초안 데이터 실시간 렌더링 관찰",
            observeAt: "playground",
          },
        ]}
      />
      <DemoPlaygroundCard title={"Bypass 쿠키 검증 및 CMS 초안 렌더링 실습"}>
        <DraftBypassDemo isDraftMode={isDraftMode} />
      </DemoPlaygroundCard>
      <VerificationFooter
        isLoaded={true}
        actual={`- draftMode().isEnabled: ${isDraftMode}`}
      />
    </DemoContainer>
  )
}
